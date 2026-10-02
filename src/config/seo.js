const SITE_NAME = "Principles";

export const pageSeo = {
  home: {
    en: {
      title: `${SITE_NAME} — Habits for Goals`,
      description:
        "Principles turns goals into daily follow-through: habits, Tasks for today, reminders, home widgets, and an AI Helper. Available on Android, iOS, and macOS.",
    },
    uk: {
      title: `${SITE_NAME} — звички для цілей`,
      description:
        "Principles перетворює цілі на щоденне виконання: звички, Tasks на сьогодні, нагадування, віджети та AI Helper. Доступно на Android, iOS та macOS.",
    },
  },
  privacyPolicy: {
    en: {
      title: "Privacy Policy — Principles",
      description:
        "Privacy Policy of Principles: how we collect, use, store, and protect your personal information when you use our app and services.",
    },
    uk: {
      title: "Політика конфіденційності — Principles",
      description:
        "Політика конфіденційності Principles: як ми збираємо, використовуємо, зберігаємо та захищаємо ваші персональні дані.",
    },
  },
  userAgreement: {
    en: {
      title: "User Agreement of the Principles",
      description:
        "User Agreement for Principles: Habits for Goals — legal terms for using the mobile application and related services.",
    },
    uk: {
      title: "Користувацька угода Principles",
      description:
        "Користувацька угода Principles: Habits for Goals — юридичні умови використання мобільного застосунку та сервісів.",
    },
  },
  settings: {
    en: {
      title: "Delete Your Account — Principles",
      description:
        "Delete your Principles account and associated data. Confirm your email and password to permanently remove your account.",
    },
    uk: {
      title: "Видалення акаунта — Principles",
      description:
        "Видаліть акаунт Principles та пов’язані дані. Підтвердіть email і пароль для остаточного видалення.",
    },
  },
};

export function getPageSeo(routeId, locale) {
  const entry = pageSeo[routeId];
  return entry?.[locale] ?? entry?.en;
}
