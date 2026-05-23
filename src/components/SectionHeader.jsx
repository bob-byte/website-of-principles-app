function SectionHeader({ title, subtitle }) {
    return (
        <>
            <h2>{title}</h2>
            <p className="section__subtitle">{subtitle}</p>
        </>
    );
}

export default SectionHeader;
