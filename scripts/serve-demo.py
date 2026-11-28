#!/usr/bin/env python3
"""Serve the downloaded demo locally with Python's standard library."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser

root = Path(__file__).resolve().parent.parent
address = "http://localhost:8080/login.html"
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
try:
    with ThreadingHTTPServer(("127.0.0.1", 8080), handler) as server:
        print(f"Diarito: {address}\nKeep this window open. Press Ctrl+C to stop.")
        threading.Timer(0.5, lambda: webbrowser.open(address)).start()
        server.serve_forever()
except KeyboardInterrupt:
    print("\nDiarito stopped.")
except OSError as error:
    print(f"Could not start port 8080: {error}")
    print("Close the other local server on port 8080 and try again.")
