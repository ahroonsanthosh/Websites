import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

const images = [
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGkP3GEjEMW7i3H2CdcolNFylU9-r19TBx5_nmpjhjo6Ofckd8ujvfIMt06-zVvV6j1wlkNSXCjWUEVB3g0WaqfB6brNfW9oePHBBlUGbOamXCtCmYsTTBvTwAmtgJmu-LTBBC801IR81J0=s1360-w1360-h1020-rw', caption: 'Morning light at the wharf' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFAQwBjNw1JPHaHvMx6VJmlDSPBYv2ihCFH1q52cOqtJ3KuOSlmdWUaJSP7L1sxT6o-jfyHZ3WhxjK1RFaB6ZRVKXGqkF6wsgqlVpq6ol9bi2KSK5-m9mGZ7ismDiAxD5Etuh-FaPOB3ozx=s1360-w1360-h1020-rw', caption: 'Fresh from the kitchen' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAF5EL_a_CK9V6t92OHt8Gbn-3m_HsPuUgkvjHOhNw2B4L5We9bZpJIWd-JvXpFKvt_7hQeJCzVt8nl73ww-dvZVYJO6LhRaomz9lIfjLnzN3vcwlU2Cji0hCjLQUIJqMr-Bszzc00-UnvI7=s1360-w1360-h1020-rw', caption: 'The space, as it is' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFaQ7So7jHLXYK4zQAiQrhlSk17tQ-xApPtWKaAEcLkEniSrlCEJl6qq675jjAK92N56e8rQ7YR_VbD_p_HEvpcG-z9rw5gH9ufKzDzaPAqGed3dJo-SM-xUbg-gaRE8yOi_S_at_x9OM4=s1360-w1360-h1020-rw', caption: 'Details that matter' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEa8CAwsCHwvGmrWa76Hyv51HvoaE8DKbYGNy6S9b9rO8cCkAGtX_tjbsicbTMlnaaUXJOLDUK4GN-HJtJ7kRzOaWwAjmuj_rgrmqYxrYJjI1yvjYPL2NJl69dDouR1tRdyoGhcIgjh9dU=s1360-w1360-h1020-rw', caption: 'Start the day right' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGY1VIcQWQyVI9EpaAgNYLM2WNp5982lAV01gqbq7bY9plRgOrQmRucPnXEQF3_br0nFTJpgibhagYQ1g-0bRA_jUKMxitnHd-bdRQ94HdCHCmW8DP-YMYIbQQHVyqD2JaNuwQObtjyTWU=s1360-w1360-h1020-rw', caption: 'Good food, simply made' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHUWxCz-3l76ngXTcOoYt52a5GeCIv2dFaJ2vpmBKAt1EY-BiEH41ghWXVOJHlkp5BzhUI4LXgKtJg-T7Fg5DhwK5irc37Rd6HLd8Gg6OhW9uggWQO35TClpSLLbMJBIq1Rk2WA56alaIVE=s1360-w1360-h1020-rw', caption: "Cork's favourite corner" },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG-f6zCJfd2JTumNQozK3uT-PA8XjKoeeVSCNcsXFTYOFmRvHRhBsqAmD5NyDRwPNrd3PwM-pEOx9HfwkzMjbuzLh_7WX7l77fTHRI6TVl9WE1a5bWQctLHv1GYLF4WHVa4IvlF_JK5LB-B=s1360-w1360-h1020-rw', caption: 'Every morning, without fail' },
];

export default function GalleryAdmin() {
  const cookieStore = cookies();
  if (cookieStore.get('hd-admin')?.value !== '1') {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <AdminSidebar />
      <main className="flex-1 p-10" aria-label="Gallery overview">
        <h1 className="font-display text-4xl text-brand-text mb-2">Gallery</h1>
        <p className="font-sans text-sm text-brand-text/50 mb-12">Current gallery images. Images are sourced from Google Maps.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden relative group">
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-bg/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="font-sans text-xs text-brand-text">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
