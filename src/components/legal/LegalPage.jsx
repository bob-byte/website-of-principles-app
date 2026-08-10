function LegalBlock({ block }) {
  if (block.type === "html") {
    return (
      <div
        className="legal-page__html"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    );
  }

  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={`legal-page__list${block.ordered ? " legal-page__list--ordered" : ""}`}>
        {block.items.map((item, index) => (
          <li key={`${index}-${item.slice(0, 24)}`}>{item}</li>
        ))}
      </Tag>
    );
  }

  if (block.type === "table") {
    return (
      <table className="legal-page__table">
        <thead>
          <tr>
            {block.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <p>{block.text}</p>;
}

function normalizeBlocks(content) {
  if (Array.isArray(content)) {
    return content.map((item) =>
      typeof item === "string" ? { type: "p", text: item } : item,
    );
  }

  if (typeof content === "string") {
    return [{ type: "p", text: content }];
  }

  return [];
}

function LegalSection({ section }) {
  const blocks = section.blocks ?? normalizeBlocks(section.content);

  return (
    <section id={section.id} className="legal-page__section">
      <h2>{section.title}</h2>
      {blocks.map((block, blockIndex) => (
        <LegalBlock key={`${section.id}-block-${blockIndex}`} block={block} />
      ))}
    </section>
  );
}

/**
 * Renders a legal/info page from a title and structured sections.
 * Each section: { id, title, content?: string | string[], blocks?: Block[] }
 */
function LegalPage({ title, updatedAt, introHtml, sections }) {
  return (
    <main className="legal-page">
      <section className="legal-page__content container">
        <h1>{title}</h1>
        {updatedAt && (
          <p className="legal-page__updated">
            <b>{updatedAt}</b>
          </p>
        )}

        {introHtml && (
          <div
            className="legal-page__intro"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        )}

        {sections.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}
      </section>
    </main>
  );
}

export default LegalPage;
