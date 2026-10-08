function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) return <code key={i}>{p.slice(1, -1)}</code>;
    return p;
  });
}

export default function Markdown({ text }) {
  const segments = text.split("```");
  return segments.map((seg, i) => {
    if (i % 2 === 1) {
      const code = seg.replace(/^[^\n]*\n/, ""); // pehli line (language name) hata do
      return (
        <pre key={i}>
          <code>{code}</code>
        </pre>
      );
    }
    
    return seg ? (
      <span key={i}>
        <Inline text={seg} />
      </span>
    ) : null;
  });
}
