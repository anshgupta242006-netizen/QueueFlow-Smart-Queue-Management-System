import http.server
import socketserver
import os

PORT = 5050
PDF_PATH = os.path.abspath("QueueLess_4Pages_Report.pdf")

class DownloadHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if not os.path.exists(PDF_PATH):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"File not found")
            return
        
        with open(PDF_PATH, 'rb') as f:
            pdf_bytes = f.read()

        self.send_response(200)
        self.send_header('Content-Type', 'application/pdf')
        self.send_header('Content-Disposition', 'attachment; filename="QueueLess_4Pages_Report.pdf"')
        self.send_header('Content-Length', str(len(pdf_bytes)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(pdf_bytes)

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), DownloadHandler) as httpd:
        httpd.serve_forever()
