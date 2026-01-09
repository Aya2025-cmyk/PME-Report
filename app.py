import gradio as gr

with gr.Blocks() as demo:
    gr.Markdown("# 📊 PME Report")
    gr.Markdown("Plateforme de reporting automatisé pour les PME")

    gr.HTML("""
    <iframe src="index.html" width="100%" height="600px"></iframe>
    """)

demo.launch()
