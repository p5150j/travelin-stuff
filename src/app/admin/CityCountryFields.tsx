"use client";

export interface KnownCity {
  city: string;
  country: string;
  count: number;
}

interface Props {
  city: string;
  country: string;
  onCityChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  /** Distinct city+country pairs already in Firestore, most-used first. */
  knownCities: KnownCity[];
  inputCls: string;
  labelCls: string;
}

/**
 * City + country entry with suggestions from what's already stored.
 *
 * Why this exists: city is a free-text field that gets retyped on every post,
 * and `getCities()` groups on the exact string. Typing "vegas" once when every
 * other post says "Vegas" splits the city into two timeline stops that share one
 * URL — and the posts under whichever casing loses become unreachable. Picking
 * from a suggestion guarantees byte-identical values.
 *
 * Deliberately chips rather than a floating listbox: no popover positioning, no
 * keyboard-nav or focus-trap to get wrong, and they're easier to hit on touch.
 * Free typing still works, so new cities are never blocked.
 */
export default function CityCountryFields({
  city,
  country,
  onCityChange,
  onCountryChange,
  knownCities,
  inputCls,
  labelCls,
}: Props) {
  const typedCity = city.trim().toLowerCase();
  const typedCountry = country.trim().toLowerCase();

  // Empty input shows the most-used cities, which covers the common case of
  // posting from the same place again.
  const suggestions = knownCities
    .filter((k) => !typedCity || k.city.toLowerCase().includes(typedCity))
    .filter((k) => k.city !== city.trim())
    .slice(0, 6);

  // Same city, different casing — the exact situation that splits a city.
  const cityClash = knownCities.find(
    (k) => k.city.toLowerCase() === typedCity && k.city !== city.trim()
  );

  const countries = [...new Set(knownCities.map((k) => k.country).filter(Boolean))];
  const countryClash = countries.find(
    (c) => c.toLowerCase() === typedCountry && c !== country.trim()
  );

  function pick(k: KnownCity) {
    onCityChange(k.city);
    if (k.country) onCountryChange(k.country);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>City</label>
          <input
            className={inputCls}
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <input
            className={inputCls}
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.6875rem] tracking-widest uppercase text-muted shrink-0">
            {typedCity ? "Matches" : "Recent"}
          </span>
          {suggestions.map((k) => (
            <button
              key={k.city}
              type="button"
              onClick={() => pick(k)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-full text-xs text-ink bg-surface hover:border-ink transition-colors"
            >
              <span className="font-medium">{k.city}</span>
              {k.country && <span className="text-muted">{k.country}</span>}
              <span className="text-faint tabular-nums">{k.count}</span>
            </button>
          ))}
        </div>
      )}

      {cityClash && (
        <Clash
          message={`"${city.trim()}" differs only in capitalisation from the existing "${cityClash.city}". Saving it as typed splits the city into two.`}
          actionLabel={`Use "${cityClash.city}"`}
          onFix={() => pick(cityClash)}
        />
      )}

      {countryClash && (
        <Clash
          message={`"${country.trim()}" differs only in capitalisation from the existing "${countryClash}".`}
          actionLabel={`Use "${countryClash}"`}
          onFix={() => onCountryChange(countryClash)}
        />
      )}
    </div>
  );
}

function Clash({
  message,
  actionLabel,
  onFix,
}: {
  message: string;
  actionLabel: string;
  onFix: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border border-gold/40 bg-gold/5 rounded-lg">
      <p className="text-xs text-ink flex-1 min-w-0 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onFix}
        className="shrink-0 px-3 py-1.5 bg-ink text-bg text-xs font-medium rounded-md hover:bg-body transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}
