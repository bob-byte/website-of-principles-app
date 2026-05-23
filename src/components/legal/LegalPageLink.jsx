function LegalPageLink({ href, children, className = "" }) {
  return (
    <a href={href} className={`legal-page-link ${className}`.trim()}>
      {children}
    </a>
  );
}

export default LegalPageLink;
