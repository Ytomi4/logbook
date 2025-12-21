import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

interface HeroSectionProps {
  isAuthenticated: boolean;
  username?: string | null;
}

export function HeroSection({ isAuthenticated, username }: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24 text-center">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
        「何を読んだか」だけでなく、
        <br className="hidden md:block" />
        「どう読んだか」を残せるアプリです
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        印象に残った単語、後から振り返りたい一文。
        <br />
        読んでいる途中でも「ログ」という形で、感想や引用を残せます。
      </p>
      <div className="mt-10">
        {isAuthenticated && username ? (
          <Link to={`/${username}`}>
            <Button size="lg" className="px-8">
              タイムラインを見る
            </Button>
          </Link>
        ) : (
          <Link to="/enter">
            <Button size="lg" className="px-8">
              はじめる
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
