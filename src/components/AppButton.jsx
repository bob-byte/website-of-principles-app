function AppButton({
    variant = "primary",
    children,
    type = "button",
    className = "",
    disabled = false,
    onClick,
}) {
    const variantClass =
        variant === "ghost"
            ? "translucent__btn"
            : variant === "danger"
              ? "settings-page__delete-btn"
              : "getStarted__btn";

    return (
        <button
            type={type}
            className={`${variantClass} ${className}`.trim()}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
export default AppButton;
