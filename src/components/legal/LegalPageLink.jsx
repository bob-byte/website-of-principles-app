function LegalPageLink({ href, children, className = "", ...props }) {
  return (
    <a href={href} className={`legal-page-link ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}

export default LegalPageLink;
