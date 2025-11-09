import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [payload, setPayload] = useState("");

  useEffect(() => {
    // ler query string ?q=...
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setPayload(q);
  }, []);

  return (
    <div className="App" style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Lab XSS — Demo (Reflective)</h1>
      <p>
        Esta página demonstra um XSS refletido. Para testar, adicione um parâmetro <code>?q=</code> na
        URL ou use o formulário abaixo.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = e.target.elements.input.value;
          // trocar a URL mantendo o parâmetro (não faz reload para o build demo)
          const newUrl = `${window.location.pathname}?q=${encodeURIComponent(v)}`;
          window.history.pushState({}, "", newUrl);
          setPayload(v);
        }}
      >
        <input name="input" placeholder="Digite payload (ex: &lt;img src=x onerror=alert(1)&gt;)" />
        <button type="submit">Enviar</button>
      </form>

      <h3>Refletido (unsafe):</h3>
      {/* Aqui intencionalmente usamos dangerouslySetInnerHTML para demonstrar o XSS */}
      <div
        style={{ border: "1px solid #ccc", padding: 12, minHeight: 60, background: "#fafafa" }}
        dangerouslySetInnerHTML={{ __html: payload }}
      />

      <hr />
      <p>
        Exemplos para testar:
        <ul>
          <li><code>?q=&lt;script&gt;alert('XSS')&lt;/script&gt;</code></li>
          <li><code>?q=&lt;img src=x onerror=alert('XSS')&gt;</code></li>
        </ul>
      </p>
    </div>
  );
}

export default App;
