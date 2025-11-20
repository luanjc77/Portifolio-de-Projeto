import { useState, useRef } from "react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const messagePreviewRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Capture message before clearing (state is asynchronous)
    const submittedMessageContent = message;

    const item = {
      id: Date.now(),
      name,
      email,
      subject,
      message: submittedMessageContent,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("th_contact_messages") || "[]";
      const arr = JSON.parse(raw);
      arr.unshift(item);
      localStorage.setItem("th_contact_messages", JSON.stringify(arr));
    } catch (err) {
      console.error("failed to save message", err);
    }

    // Clear form fields
    setSubject("");
    setMessage("");
    
    // Render message as raw HTML in the preview div so scripts execute (XSS vulnerability for lab)
    if (messagePreviewRef.current) {
      messagePreviewRef.current.innerHTML = submittedMessageContent;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-4">Contato</h1>
      <p className="mb-6 text-muted-foreground">Envie uma mensagem para nossa equipe.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assunto</label>
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem</label>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full textarea" rows={6} />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">Enviar</button>
        </div>
      </form>

      {/* Traditional XSS vulnerability: render submitted message as raw HTML with script execution.
          This is deliberately insecure and exists only in this controlled lab environment. */}
      <div className="mt-6 p-3 text-xs text-muted-foreground bg-muted/5 rounded">
        <div ref={messagePreviewRef} />
      </div>
    </div>
  );
};

export default ContactForm;
