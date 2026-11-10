import os

md_path = 'QueueLess_College_Project_Report.md'
with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QueueLess - Academic College Project Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --bg-body: #f8fafc;
            --border-color: #e2e8f0;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-main);
            background-color: var(--bg-body);
            line-height: 1.7;
            font-size: 15px;
        }

        /* Top Action Bar */
        .top-bar {
            position: sticky;
            top: 0;
            z-index: 999;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(12px);
            color: #fff;
            padding: 12px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .top-bar-title {
            font-size: 1rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .top-bar-title span {
            color: #38bdf8;
            font-size: 0.8rem;
            padding: 2px 8px;
            background: rgba(56, 189, 248, 0.15);
            border-radius: 999px;
            border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .top-bar-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .btn-download {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #fff;
            font-weight: 700;
            padding: 9px 18px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .btn-download:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
        }

        .btn-back {
            background: rgba(255, 255, 255, 0.1);
            color: #f1f5f9;
            padding: 8px 14px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .btn-back:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Document Container */
        .doc-wrapper {
            max-width: 960px;
            margin: 40px auto;
            background: #ffffff;
            padding: 60px 80px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.06);
            border: 1px solid var(--border-color);
        }

        h1, h2, h3, h4 {
            color: #0f172a;
            font-weight: 700;
            line-height: 1.3;
        }

        h1 {
            font-size: 2.2rem;
            margin-top: 40px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
        }

        h1:first-of-type {
            margin-top: 0;
            text-align: center;
            border-bottom: none;
        }

        h2 {
            font-size: 1.5rem;
            margin-top: 45px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1.5px solid #f1f5f9;
            color: #1e3a8a;
        }

        h3 {
            font-size: 1.2rem;
            margin-top: 28px;
            margin-bottom: 12px;
            color: #0f172a;
        }

        p {
            margin-bottom: 16px;
            text-align: justify;
        }

        hr {
            margin: 40px 0;
            border: none;
            border-top: 1.5px dashed #cbd5e1;
        }

        ul, ol {
            margin-left: 24px;
            margin-bottom: 18px;
        }

        li {
            margin-bottom: 6px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            font-size: 0.92rem;
            background: #fff;
        }

        table th, table td {
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            text-align: left;
        }

        table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
        }

        table tr:nth-child(even) td {
            background-color: #f8fafc;
        }

        code {
            font-family: 'JetBrains Mono', monospace;
            background: #f1f5f9;
            color: #0f172a;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.88em;
            border: 1px solid #e2e8f0;
        }

        pre {
            background: #0f172a;
            color: #f8fafc;
            padding: 16px 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            font-size: 0.9rem;
        }

        pre code {
            background: transparent;
            color: inherit;
            padding: 0;
            border: none;
        }

        .mermaid {
            display: flex;
            justify-content: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 24px;
            margin: 26px 0;
            overflow-x: auto;
        }

        /* Print formatting */
        @media print {
            .top-bar {
                display: none !important;
            }
            body {
                background: #ffffff !important;
                color: #000 !important;
                font-size: 11pt !important;
            }
            .doc-wrapper {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 10mm 15mm !important;
                box-shadow: none !important;
                border: none !important;
            }
            h1 {
                page-break-before: always;
            }
            h1:first-of-type {
                page-break-before: avoid;
            }
            table, .mermaid, pre {
                page-break-inside: avoid;
            }
            a {
                color: #000 !important;
                text-decoration: underline;
            }
        }
    </style>
</head>
<body>
    <header class="top-bar">
        <div class="top-bar-title">
            <strong>QueueLess Academic Report</strong>
            <span>College Submission Ready</span>
        </div>
        <div class="top-bar-actions">
            <a href="/" class="btn-back">← Project Home</a>
            <button onclick="window.print()" class="btn-download">
                🖨️ Download as PDF (Ctrl+P)
            </button>
        </div>
    </header>

    <main class="doc-wrapper">
        <div id="report-render">Rendering academic report...</div>
    </main>

    <script id="markdown-source" type="text/plain">''' + md_content.replace('</script>', '<\\/script>') + '''</script>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const rawMd = document.getElementById('markdown-source').textContent;
            
            const renderer = new marked.Renderer();
            const defaultCodeRenderer = renderer.code.bind(renderer);
            
            renderer.code = function(code, lang, escaped) {
                if (lang === 'mermaid') {
                    return '<div class="mermaid">' + code + '</div>';
                }
                return defaultCodeRenderer(code, lang, escaped);
            };

            marked.setOptions({
                renderer: renderer,
                gfm: true,
                breaks: false
            });

            const htmlContent = marked.parse(rawMd);
            const container = document.getElementById('report-render');
            container.innerHTML = htmlContent;

            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose'
            });

            await mermaid.run({
                nodes: document.querySelectorAll('.mermaid')
            });
        });
    </script>
</body>
</html>
'''

with open('QueueLess_College_Project_Report.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

with open('src/main/resources/static/report.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

import os.path
if os.path.exists('target/classes/static'):
    with open('target/classes/static/report.html', 'w', encoding='utf-8') as f:
        f.write(html_template)

print("Generated HTML report successfully.")

