'use client';

interface DisplayProps {
  readonly: true;
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
}

interface InteractiveProps {
  readonly: false;
  value: number;
  onChange: (n: number) => void;
}

type Props = DisplayProps | InteractiveProps;

export default function StarRating(props: Props) {
  if (props.readonly) {
    const { rating, count, size = 'md' } = props;
    const starSize = size === 'sm' ? 'text-sm' : 'text-xl';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
      <span className="inline-flex items-center gap-1">
        <span className={starSize}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ color: i <= Math.round(rating) ? '#F4A261' : '#D1D5DB' }}>
              ★
            </span>
          ))}
        </span>
        {count !== undefined && (
          <span className={`${textSize} text-gray-500`}>({count})</span>
        )}
      </span>
    );
  }

  return <InteractiveStar value={props.value} onChange={props.onChange} />;
}

function InteractiveStar({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="text-3xl leading-none focus:outline-none transition-colors"
          style={{ color: i <= value ? '#F4A261' : '#D1D5DB' }}
        >
          ★
        </button>
      ))}
    </span>
  );
}
