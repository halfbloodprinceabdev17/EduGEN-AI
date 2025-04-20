import streamlit as st
import os
import fitz  # PyMuPDF
import random
import re

from mcq_parser import extract_mcqs_from_pdf
from groq_helper import get_llm_feedback

# --- App Title ---
st.title("📘 MCQ Quiz App with AI Tutor")
st.write("Upload an MCQ PDF, answer the questions, and get fun feedback from an AI! 🤖")

# --- Safe Session Initialization ---
if "score" not in st.session_state:
    st.session_state.score = 0
if "answered" not in st.session_state:
    st.session_state.answered = []
if "current_pdf" not in st.session_state:
    st.session_state.current_pdf = None

# --- PDF Storage Folder ---
pdf_folder = "pdf_files"
os.makedirs(pdf_folder, exist_ok=True)

# --- PDF Preview Function ---
def show_pdf_preview(pdf_file):
    pdf_file.seek(0)
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    images = []
    for page_num in range(min(2, doc.page_count)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        img = pix.tobytes("png")
        images.append(img)
    st.subheader("📄 PDF Preview")
    for img in images:
        st.image(img, use_column_width=True)

# --- LaTeX Math Checker ---
latex_math_pattern = re.compile(r'\\\[(.*?)\\\]', re.DOTALL)

def contains_latex_math(content):
    return bool(latex_math_pattern.search(content))

# --- Upload New PDF ---
uploaded_file = st.file_uploader("📤 Upload MCQ PDF", type=["pdf"])

if uploaded_file:
    file_path = os.path.join(pdf_folder, uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    st.success(f"PDF saved as {uploaded_file.name}!")

    st.session_state.current_pdf = uploaded_file.name
    st.session_state.score = 0
    st.session_state.answered = []

    show_pdf_preview(uploaded_file)

# --- Load from Saved PDFs ---
st.subheader("📁 Previously Uploaded PDFs")
pdf_files = [f for f in os.listdir(pdf_folder) if f.endswith(".pdf")]
selected_pdf = st.selectbox("Select a PDF to take the quiz:", pdf_files)

if selected_pdf:
    st.session_state.current_pdf = selected_pdf
    file_path = os.path.join(pdf_folder, selected_pdf)
    with open(file_path, "rb") as f:
        mcqs = extract_mcqs_from_pdf(f)

    for i, q in enumerate(mcqs):
        if i in st.session_state.answered:
            continue

        st.markdown(f"**Q{i+1}.** {q['question']}")
        options_clean = [opt[2:].strip() if len(opt) > 2 and opt[1] == '.' else opt for opt in q["options"]]
        user_choice = st.radio("Choose one:", options_clean, key=f"option_{i}")

        if st.button("Submit", key=f"submit_{i}"):
            selected_option = None
            for opt in q["options"]:
                if user_choice in opt:
                    selected_option = opt[0]
                    break

            correct_option = q["answer"]

            if selected_option == correct_option:
                st.success("✅ Correct! You're on fire! 🔥")
                st.balloons()
                st.session_state.score += 1
                happy_gifs = [
                    "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
                    "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
                    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
                ]
                st.image(random.choice(happy_gifs), caption="Great job!")
            else:
                st.error("❌ Oops, not quite right!")

                explanation = get_llm_feedback(
                    q["question"], q["options"], selected_option, correct_option
                )

                st.markdown("### 🤖 AI Tutor's Take:")
                if contains_latex_math(explanation):
                    st.latex(explanation)
                else:
                    formatted_explanation = explanation.replace('\n', '<br>')
                    st.markdown(
                        f"""
                        <div style='background-color:#f9f9f9;color:#000000;padding:15px;
                        border-radius:10px;border-left:5px solid #4CAF50;'>{formatted_explanation}</div>
                        """,
                        unsafe_allow_html=True,
                    )

                sad_gifs = [
                    "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif",
                    "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
                    "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif"
                ]
                st.image(random.choice(sad_gifs), caption="Keep going, you're learning!")

            st.session_state.answered.append(i)
            # st.rerun()  # replaces experimental_rerun
        st.stop()

    # --- Final Score ---
    if len(st.session_state.answered) == len(mcqs):
        st.markdown(f"## 🏁 Final Score: **{st.session_state.score} / {len(mcqs)}**")

        if st.button("🔁 Restart Quiz"):
            st.session_state.score = 0
            st.session_state.answered = []
            st.rerun()
