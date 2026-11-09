-- ==============================================================================
-- THE DATA MASTER — PostgreSQL / Supabase Initial Schema & RLS Policies
-- "Learn. Analyse. Master Data."
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_experience_level AS ENUM ('Complete beginner', 'Basic knowledge', 'Intermediate', 'Advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status_type AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mistake_review_status AS ENUM ('needs_review', 'marked_for_revision', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT DEFAULT 'Analytics Practitioner',
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio TEXT,
    target_role TEXT DEFAULT 'Data Analyst',
    experience_level user_experience_level DEFAULT 'Intermediate',
    daily_commitment_minutes INTEGER DEFAULT 30,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    selected_domains JSONB DEFAULT '[]'::jsonb,
    completed_topics JSONB DEFAULT '[]'::jsonb,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{"theme": "dark", "enableAIAssistant": true, "soundEffects": true, "weeklyGoalMinutes": 180, "isPortfolioPublic": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRACTICE ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.practice_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    submitted_answer TEXT,
    expected_answer TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MISTAKE JOURNAL TABLE
CREATE TABLE IF NOT EXISTS public.mistake_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    exercise_title TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    topic_title TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    submitted_answer TEXT,
    expected_answer TEXT,
    error_category TEXT NOT NULL,
    explanation TEXT,
    attempt_count INTEGER DEFAULT 1,
    review_status mistake_review_status DEFAULT 'needs_review',
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHALLENGE & SIMULATION SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    submission_type TEXT NOT NULL, -- 'challenge', 'simulation', 'detective', 'competition'
    score INTEGER NOT NULL,
    feedback TEXT,
    memo TEXT,
    task_answers JSONB DEFAULT '{}'::jsonb,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PORTFOLIO PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    short_description TEXT,
    domain_id TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    problem_statement TEXT,
    business_context TEXT,
    dataset_info JSONB DEFAULT '{}'::jsonb,
    tools JSONB DEFAULT '[]'::jsonb,
    methodology TEXT,
    analysis_and_findings TEXT,
    conclusions_and_recommendations TEXT,
    skills_demonstrated JSONB DEFAULT '[]'::jsonb,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    status project_status_type DEFAULT 'draft',
    is_public BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMUNITY DISCUSSIONS & REPLIES
CREATE TABLE IF NOT EXISTS public.community_discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    domain_id TEXT,
    upvotes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_solved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES public.community_discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_accepted_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COLLABORATIVE TEAMS & TASKS
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    focus_domain TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.team_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to_user_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PLANNED SESSIONS (LEARNING CALENDAR)
CREATE TABLE IF NOT EXISTS public.planned_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    title TEXT NOT NULL,
    domain_id TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    target_minutes INTEGER DEFAULT 30,
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own record; public can read basic author info
CREATE POLICY "Users can manage their own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable for portfolio/community attribution"
    ON public.profiles FOR SELECT
    USING (true);

-- Practice Attempts & Mistakes: Strict User Isolation
CREATE POLICY "Learners can manage own practice attempts"
    ON public.practice_attempts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners can manage own mistake records"
    ON public.mistake_records FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners can manage own challenge submissions"
    ON public.challenge_submissions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners can manage own planned sessions"
    ON public.planned_sessions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Portfolio Projects: Owner has full control; Public can view published public projects
CREATE POLICY "Authors full control of their portfolio projects"
    ON public.portfolio_projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read for published case studies"
    ON public.portfolio_projects FOR SELECT
    USING (status = 'published' AND is_public = true);

-- Community Discussions: Authenticated authors can create/edit; Everyone can read
CREATE POLICY "Everyone can read discussions"
    ON public.community_discussions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create discussions"
    ON public.community_discussions FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update or delete own discussions"
    ON public.community_discussions FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Everyone can read discussion replies"
    ON public.discussion_replies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add replies"
    ON public.discussion_replies FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Teams: Members can access team tasks and boards
CREATE POLICY "Members can view their teams"
    ON public.teams FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE team_id = id AND user_id = auth.uid()));

CREATE POLICY "Authenticated users can create teams"
    ON public.teams FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can read and update team tasks"
    ON public.team_tasks FOR ALL
    USING (EXISTS (SELECT 1 FROM public.team_members WHERE team_id = team_tasks.team_id AND user_id = auth.uid()));

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ==============================================================================

-- Datasets Bucket (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;

-- Portfolio Assets Bucket (Public Read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Users can upload own datasets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own datasets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read for portfolio assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-assets');
