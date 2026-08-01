export function scrollToBenefitsSection() {
  const target = document.getElementById("benefits");
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}
