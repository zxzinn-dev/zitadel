export function SourceOffer({ label }: { label: string }) {
  return (
    <a
      href="https://github.com/zxzinn-dev/zitadel/blob/ddc94bda70ec18f7ef09187c9297ba27f0f6bccc/contrib/northbrio/README.md"
      rel="noreferrer"
      className="source-offer text-text-light-500 dark:text-text-dark-500 inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
    </a>
  );
}
