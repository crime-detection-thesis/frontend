import { useEffect } from "react";

const BASE_TITLE = "AlertaCrimenPeru";

export default function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
  return null;
}
