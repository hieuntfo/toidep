import React, { useState, useEffect } from 'react';
import { 
  INITIAL_POSTS, INITIAL_SALONS, INITIAL_REVIEWS, INITIAL_USERS, INITIAL_ARTICLES 
} from './lib/mockData';
import { Post, Salon, BookingRequest, Review, LogoConcept, Article, UserProfile } from './types';
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
import { SeoLandingView } from './components/views/SeoLandingView';
import { NewsEditorialView } from './components/views/NewsEditorialView';
import { ArticleDetailView } from './components/views/ArticleDetailView';
import { SEO_AREAS, SEO_SERVICES } from './lib/seoData';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { BookingSheetModal } from './components/modals/BookingSheetModal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';
import { AuthModal } from './components/modals/AuthModal';
import { SalonOwnerEditModal } from './components/modals/SalonOwnerEditModal';
import { 
  fetchRemotePosts, 
  fetchRemoteSalons, 
  fetchRemoteArticles,
  fetchRemoteUsers,
  insertPostToSupabase, 
  insertBookingToSupabase,
  insertArticleToSupabase,
  upsertUserToSupabase,
  pushSalonsToSupabase
} from './lib/supabase';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<string>('explore');
  const [activeSalonId, setActiveSalonId] = useState<string>('salon-1');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Application Data States (synced with localStorage & Supabase)
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('toidep_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [salons, setSalons] = useState<Salon[]>(() => {
    const saved = localStorage.getItem('toidep_salons');
    return saved ? JSON.parse(saved) : INITIAL_SALONS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('toidep_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('toidep_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current Logged-In User
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('toidep_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[3]; // Default logged-in as customer Phương Thảo
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
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [salonEditModalOpen, setSalonEditModalOpen] = useState(false);
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);

  const [activeConcept, setActiveConcept] = useState<LogoConcept | 'RECOMMENDED'>('RECOMMENDED');
  const [seoAreaId, setSeoAreaId] = useState<string>('hoan-kiem');
  const [seoServiceSlug, setSeoServiceSlug] = useState<string>('lam-nail');

  // Initial Sync from Supabase
  useEffect(() => {
    async function syncRemoteData() {
      try {
        const [remotePosts, remoteSalons, remoteArticles, remoteUsers] = await Promise.all([
          fetchRemotePosts(),
          fetchRemoteSalons(),
          fetchRemoteArticles(),
          fetchRemoteUsers()
        ]);

        if (remotePosts && remotePosts.length > 0) {
          setPosts(prev => {
            const remoteMap = new Map(remotePosts.map(p => [p.id, p]));
            const combined = [...remotePosts];
            for (const p of prev) {
              if (!remoteMap.has(p.id)) combined.push(p);
            }
            return combined;
          });
        }

        if (remoteSalons && remoteSalons.length > 0) {
          setSalons(prev => {
            const remoteMap = new Map(remoteSalons.map(s => [s.id, s]));
            const combined = [...remoteSalons];
            for (const s of prev) {
              if (!remoteMap.has(s.id)) combined.push(s);
            }
            return combined;
          });
        }

        if (remoteArticles && remoteArticles.length > 0) {
          setArticles(prev => {
            const remoteMap = new Map(remoteArticles.map(a => [a.id, a]));
            const combined = [...remoteArticles];
            for (const a of prev) {
              if (!remoteMap.has(a.id)) combined.push(a);
            }
            return combined;
          });
        }

        if (remoteUsers && remoteUsers.length > 0) {
          setUsers(prev => {
            const remoteMap = new Map(remoteUsers.map(u => [u.id, u]));
            const combined = [...remoteUsers];
            for (const u of prev) {
              if (!remoteMap.has(u.id)) combined.push(u);
            }
            return combined;
          });
        }
      } catch (err) {
        console.warn('Initial Supabase sync check:', err);
      }
    }
    syncRemoteData();
  }, []);

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
    localStorage.setItem('toidep_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('toidep_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('toidep_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('toidep_current_user');
    }
  }, [currentUser]);

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
    insertBookingToSupabase(newBooking).catch(err => console.warn('Booking sync notice:', err));
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  // Salon verification
  const handleToggleVerifySalon = (salonId: string) => {
    setSalons(prev => prev.map(s => s.id === salonId ? { ...s, isVerified: !s.isVerified } : s));
  };

  // Create Lookbook Post / Product
  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    insertPostToSupabase(newPost).catch(err => console.warn('Post sync notice:', err));
    setActiveView('explore');
    setSelectedPost(newPost);
  };

  const handleViewSalon = (salonId: string) => {
    setActiveSalonId(salonId);
    setActiveView('salon-profile');
    if (selectedPost) setSelectedPost(null);
  };

  // Longform Article navigation
  const handleSelectArticle = (article: Article) => {
    setActiveArticle(article);
    setActiveView('article-detail');
  };

  // User management updates
  const handleUpdateUsers = (updatedUsers: UserProfile[]) => {
    setUsers(updatedUsers);
    if (currentUser) {
      const refreshed = updatedUsers.find(u => u.id === currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  };

  // Salon owner editing
  const handleOpenSalonEdit = (salon: Salon) => {
    setEditingSalon(salon);
    setSalonEditModalOpen(true);
  };

  const handleSaveSalon = (updated: Salon) => {
    setSalons(prev => prev.map(s => s.id === updated.id ? updated : s));
    pushSalonsToSupabase([updated]).catch(err => console.warn('Update salon notice:', err));
  };

  // Find active salon for profile
  const activeSalon = salons.find(s => s.id === activeSalonId) || salons[0];
  const selectedPostSalon = selectedPost ? (salons.find(s => s.id === selectedPost.salonId) || salons[0]) : salons[0];

  // User connected salon if salon_pro
  const userSalon = salons.find(s => s.id === currentUser?.salonId) || salons[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-[#1E1E24]">
      {/* Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        activeConcept={activeConcept}
        onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
        savedCount={savedPostIds.length}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogoutUser={() => setCurrentUser(null)}
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

        {activeView === 'news' && (
          <NewsEditorialView
            articles={articles}
            onSelectArticle={handleSelectArticle}
            salons={salons}
            posts={posts}
            onOpenAdminCms={() => setActiveView('admin')}
          />
        )}

        {activeView === 'article-detail' && activeArticle && (
          <ArticleDetailView
            article={activeArticle}
            onBack={() => setActiveView('news')}
            salons={salons}
            posts={posts}
            onSelectSalon={handleViewSalon}
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
            onOpenSupabaseConfig={() => setSupabaseModalOpen(true)}
          />
        )}

        {activeView === 'profile' && (
          <UserProfileView
            savedPosts={posts.filter(p => savedPostIds.includes(p.id))}
            bookings={bookings}
            salons={salons}
            onSelectPost={(post) => setSelectedPost(post)}
            onViewSalon={handleViewSalon}
            currentUser={currentUser}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {activeView === 'business' && (
          <SalonDashboardView
            salon={userSalon}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onViewSalon={handleViewSalon}
            onOpenEditSalon={() => handleOpenSalonEdit(userSalon)}
          />
        )}

        {activeView === 'seo' && (
          <SeoLandingView
            area={SEO_AREAS.find(a => a.id === seoAreaId) || SEO_AREAS[0]}
            service={SEO_SERVICES.find(s => s.slug === seoServiceSlug) || SEO_SERVICES[0]}
            salons={salons}
            posts={posts}
            onSelectPost={(post) => setSelectedPost(post)}
            onBookNow={handleBookNow}
            onViewSalon={handleViewSalon}
            onChangeArea={(areaId) => setSeoAreaId(areaId)}
            onChangeService={(serviceSlug) => setSeoServiceSlug(serviceSlug)}
            onOpenSeoInspector={() => setActiveView('admin')}
          />
        )}

        {activeView === 'admin' && (
          <AdminCmsView
            salons={salons}
            posts={posts}
            bookings={bookings}
            articles={articles}
            users={users}
            onToggleVerifySalon={handleToggleVerifySalon}
            onDeletePost={(postId) => setPosts(prev => prev.filter(p => p.id !== postId))}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddSalon={(newSalon) => setSalons(prev => [newSalon, ...prev])}
            onUpdateSalon={handleSaveSalon}
            onUpdateArticles={(updated) => setArticles(updated)}
            onUpdateUsers={handleUpdateUsers}
            onPreviewArticle={(art) => {
              setActiveArticle(art);
              setActiveView('article-detail');
            }}
            onOpenSalonEdit={handleOpenSalonEdit}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        activeConcept={activeConcept}
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

      {/* Supabase Connection Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* User Login / Register / Forgot Password Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          // If user role is salon_pro, open salon dashboard
          if (user.role === 'salon_pro') {
            setActiveView('business');
          }
        }}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Salon Owner Edit Modal (Salon Pro) */}
      {editingSalon && (
        <SalonOwnerEditModal
          isOpen={salonEditModalOpen}
          onClose={() => {
            setSalonEditModalOpen(false);
            setEditingSalon(null);
          }}
          salon={editingSalon}
          onSaveSalon={handleSaveSalon}
        />
      )}
    </div>
  );
}
