import { UrlShortener } from "@/components/hero/UrlShortener";

export function FinalShortener() {
  return (
    <section
      id="shorten-again"
      aria-labelledby="final-heading"
      className="border-t border-hairline py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:items-start">
          <h2 id="final-heading" className="display-md text-graphite">
            have a long url?
          </h2>
          <UrlShortener idPrefix="final" />
        </div>
      </div>
    </section>
  );
}
