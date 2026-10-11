import React, { useState, useEffect } from 'react';
import { 
  INITIAL_POSTS, INITIAL_SALONS, INITIAL_REVIEWS 
} from './lib/mockData';
import { Post, Salon, BookingRequest, Review, LogoConcept } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ExploreFeed } from './components/views/ExploreFeed';
import { NearMeView } from './components/views/NearMeView';
import { FollowingFeed } from './components/views/FollowingFeed';
import { SalonProfileView } from './components/views/SalonProfileView';
import { CreatePostView } from './components/views/CreatePostView';
import { UserProfileView } from './components/views/UserProfileView';
import { SalonDashboardView } from './components/views/SalonDashboardView';
import { AdminCmsView } from './components/views/AdminCmsView';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { BookingSheetModal } from './components/modals/BookingSheetModal';
import { BrandShowcaseModal } from './components/modals/BrandShowcaseModal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<string>('explore');
  const [activeSalonId, setActiveSalonId] = useState<string>('salon-1');

  // Application Data States (synced with localStorage)
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('toidep_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [salons, setSalons] = useState<Salon[]>(() => {
    const saved = localStorage.getItem('toidep_salons');
    return saved ? JSON.parse(saved) : INITIAL_SALONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('toidep_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('toidep_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'bk-init-1',
        postId: 'post-1',
        postTitle: 'Tóc Layer Nữ Sóng Lơi Tự Nhiên & Mái Bay',
        postImage: '/src/assets/images/hair_layer_woman_1791614539000.jpg',
        styleName: 'Layer Sóng Lơi + Mái Bay',
        salonId: 'salon-1',
        salonName: 'Aurora Hair Atelier',
        stylistName: 'Hoàng Minh (Minh Layer)',
        customerName: 'Phương Thảo',
        customerPhone: '0912 345 678',
        date: 'Hôm nay (10/10)',
        timeSlot: '14:30',
        status: 'confirmed',
        createdAt: 'Hôm nay · 09:30',
        estimatedPrice: '850.000đ - 1.150.000đ'
      }
    ];
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('toidep_saved_ids');
    return saved ? JSON.parse(saved) : ['post-1', 'post-3'];
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('toidep_liked_ids');
    return saved ? JSON.parse(saved) : ['post-1'];
  });

  // Modal States
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [bookingPost, setBookingPost] = useState<{ post: Post; salon: Salon } | null>(null);
  const [brandStudioOpen, setBrandStudioOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [activeConcept, setActiveConcept] = useState<LogoConcept | 'RECOMMENDED'>('RECOMMENDED');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('toidep_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('toidep_salons', JSON.stringify(salons));
  }, [salons]);

  useEffect(() => {
    localStorage.setItem('toidep_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('toidep_saved_ids', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  useEffect(() => {
    localStorage.setItem('toidep_liked_ids', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  // Social interactions
  const handleToggleLike = (postId: string) => {
    setLikedPostIds(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleToggleSave = (postId: string) => {
    setSavedPostIds(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  // Booking Flow ("Làm kiểu này" Epicenter)
  const handleBookNow = (post: Post, salon: Salon) => {
    setBookingPost({ post, salon });
  };

  const handleConfirmBooking = (newBooking: BookingRequest) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  // Salon verification
  const handleToggleVerifySalon = (salonId: string) => {
    setSalons(prev => prev.map(s => s.id === salonId ? { ...s, isVerified: !s.isVerified } : s));
  };

  // Create Lookbook Post
  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setActiveView('explore');
    setSelectedPost(newPost);
  };

  const handleViewSalon = (salonId: string) => {
    setActiveSalonId(salonId);
    setActiveView('salon-profile');
    if (selectedPost) setSelectedPost(null);
  };

  // Find active salon for profile
  const activeSalon = salons.find(s => s.id === activeSalonId) || salons[0];
  const selectedPostSalon = selectedPost ? (salons.find(s => s.id === selectedPost.salonId) || salons[0]) : salons[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-[#1E1E24]">
      {/* Header complying with Top Bar Contract */}
      <Header
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        activeConcept={activeConcept}
        onOpenBrandStudio={() => setBrandStudioOpen(true)}
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
        savedCount={savedPostIds.length}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'explore' && (
          <ExploreFeed
            posts={posts}
            salons={salons}
            onSelectPost={(post) => setSelectedPost(post)}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            savedPostIds={savedPostIds}
            likedPostIds={likedPostIds}
            onToggleLike={handleToggleLike}
            onViewSalon={handleViewSalon}
            onOpenBrandStudio={() => setBrandStudioOpen(true)}
          />
        )}

        {activeView === 'near-me' && (
          <NearMeView
            salons={salons}
            posts={posts}
            onSelectPost={(post) => setSelectedPost(post)}
            onViewSalon={handleViewSalon}
            onBookNow={handleBookNow}
          />
        )}

        {activeView === 'following' && (
          <FollowingFeed
            posts={posts}
            salons={salons}
            onSelectPost={(post) => setSelectedPost(post)}
            onBookNow={handleBookNow}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            likedPostIds={likedPostIds}
            savedPostIds={savedPostIds}
            onViewSalon={handleViewSalon}
          />
        )}

        {activeView === 'salon-profile' && (
          <SalonProfileView
            salon={activeSalon}
            posts={posts}
            reviews={reviews}
            onSelectPost={(post) => setSelectedPost(post)}
            onBookNow={handleBookNow}
            onBackToFeed={() => setActiveView('explore')}
          />
        )}

        {activeView === 'create' && (
          <CreatePostView
            salons={salons}
            onCreatePost={handleCreatePost}
            onCancel={() => setActiveView('explore')}
          />
        )}

        {activeView === 'profile' && (
          <UserProfileView
            savedPosts={posts.filter(p => savedPostIds.includes(p.id))}
            bookings={bookings}
            salons={salons}
            onSelectPost={(post) => setSelectedPost(post)}
            onViewSalon={handleViewSalon}
          />
        )}

        {activeView === 'business' && (
          <SalonDashboardView
            salon={salons[0]}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onViewSalon={handleViewSalon}
          />
        )}

        {activeView === 'admin' && (
          <AdminCmsView
            salons={salons}
            posts={posts}
            onToggleVerifySalon={handleToggleVerifySalon}
            onDeletePost={(postId) => setPosts(prev => prev.filter(p => p.id !== postId))}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        activeConcept={activeConcept}
        onOpenBrandStudio={() => setBrandStudioOpen(true)}
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
        onNavigate={(view) => setActiveView(view)}
      />

      {/* Post Detail Modal (/p/{id}) */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          salon={selectedPostSalon}
          stylists={selectedPostSalon.stylists}
          isOpen={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          onBookNow={handleBookNow}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          isLiked={likedPostIds.includes(selectedPost.id)}
          isSaved={savedPostIds.includes(selectedPost.id)}
          onViewSalon={handleViewSalon}
        />
      )}

      {/* Epicenter Booking Sheet Modal */}
      {bookingPost && (
        <BookingSheetModal
          isOpen={Boolean(bookingPost)}
          onClose={() => setBookingPost(null)}
          post={bookingPost.post}
          salon={bookingPost.salon}
          stylists={bookingPost.salon.stylists}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Brand & Logo Identity Studio Modal */}
      <BrandShowcaseModal
        isOpen={brandStudioOpen}
        onClose={() => setBrandStudioOpen(false)}
        activeConcept={activeConcept}
        onSelectConcept={(concept) => setActiveConcept(concept)}
      />

      {/* Supabase Connection Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}
