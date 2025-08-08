import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import './Loader.css' // ✅ New CSS for the terminal loader

function App() {
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3002/ai/get-response', { code })
      setReview(response.data.response)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">Review</div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[ rehypeHighlight ]}>
            {review}
          </Markdown>
        </div>
      </main>

      {/* ✅ Terminal Loader Overlay */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
        <div class="loader-wrapper">
  <span class="loader-letter">G</span>
  <span class="loader-letter">e</span>
  <span class="loader-letter">n</span>
  <span class="loader-letter">e</span>
  <span class="loader-letter">r</span>
  <span class="loader-letter">a</span>
  <span class="loader-letter">t</span>
  <span class="loader-letter">i</span>
  <span class="loader-letter">n</span>
  <span class="loader-letter">g</span>

  <div class="loader"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
