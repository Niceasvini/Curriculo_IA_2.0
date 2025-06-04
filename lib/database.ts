import { supabase, mockData, isSupabaseConfigured } from "./supabase"

// Jobs
export async function getJobs() {
  if (!isSupabaseConfigured()) {
    return { data: mockData.jobs, error: null }
  }

  const { data, error } = await supabase!.from("jobs").select("*").order("created_at", { ascending: false })
  return { data, error }
}

export async function createJob(job: any) {
  if (!isSupabaseConfigured()) {
    const newJob = {
      id: Date.now().toString(),
      ...job,
      created_at: new Date().toISOString(),
    }
    mockData.jobs.unshift(newJob)
    return { data: newJob, error: null }
  }

  const { data, error } = await supabase!.from("jobs").insert([job]).select().single()
  return { data, error }
}

export async function updateJob(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    const jobIndex = mockData.jobs.findIndex((job) => job.id === id)
    if (jobIndex !== -1) {
      mockData.jobs[jobIndex] = { ...mockData.jobs[jobIndex], ...updates }
      return { data: mockData.jobs[jobIndex], error: null }
    }
    return { data: null, error: { message: "Job not found" } }
  }

  const { data, error } = await supabase!.from("jobs").update(updates).eq("id", id).select().single()
  return { data, error }
}

export async function deleteJob(id: string) {
  if (!isSupabaseConfigured()) {
    const jobIndex = mockData.jobs.findIndex((job) => job.id === id)
    if (jobIndex !== -1) {
      mockData.jobs.splice(jobIndex, 1)
      return { error: null }
    }
    return { error: { message: "Job not found" } }
  }

  const { error } = await supabase!.from("jobs").delete().eq("id", id)
  return { error }
}

// Candidates
export async function getCandidates() {
  if (!isSupabaseConfigured()) {
    return { data: mockData.candidates, error: null }
  }

  const { data, error } = await supabase!
    .from("applications")
    .select(`
      *,
      candidates (*),
      jobs (title)
    `)
    .order("created_at", { ascending: false })

  // Transform data to match expected format
  const transformedData = data?.map((app) => ({
    id: app.candidates?.id || app.id,
    name: app.candidates?.name || "Unknown",
    email: app.candidates?.email || "",
    phone: app.candidates?.phone || "",
    job_id: app.job_id,
    job_title: app.jobs?.title || "Unknown",
    score: app.compatibility_score || 0,
    status: app.status,
    created_at: app.created_at,
    resume_url: app.candidates?.resume_url,
    keywords: app.ai_analysis?.keywords || [],
    feedback: app.feedback,
  }))

  return { data: transformedData, error }
}

export async function createCandidate(candidateData: any) {
  if (!isSupabaseConfigured()) {
    const job = mockData.jobs.find((j) => j.id === candidateData.job_id)
    const newCandidate = {
      id: Date.now().toString(),
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      job_id: candidateData.job_id,
      job_title: job?.title || "Unknown",
      score: candidateData.score || 0,
      status: candidateData.status || "pending",
      created_at: new Date().toISOString(),
      resume_url: null,
      keywords: candidateData.keywords || [],
      feedback: candidateData.feedback,
    }
    mockData.candidates.unshift(newCandidate)
    return { data: newCandidate, error: null }
  }

  try {
    // Create candidate first
    const { data: candidate, error: candidateError } = await supabase!
      .from("candidates")
      .insert([
        {
          name: candidateData.name,
          email: candidateData.email,
          phone: candidateData.phone,
          resume_text: candidateData.resume_text,
        },
      ])
      .select()
      .single()

    if (candidateError) throw candidateError

    // Create application
    const { data: application, error: applicationError } = await supabase!
      .from("applications")
      .insert([
        {
          job_id: candidateData.job_id,
          candidate_id: candidate.id,
          status: candidateData.status || "pending",
          compatibility_score: candidateData.score || 0,
          ai_analysis: {
            keywords: candidateData.keywords || [],
            recommendations: candidateData.feedback || "",
          },
          feedback: candidateData.feedback,
        },
      ])
      .select()
      .single()

    if (applicationError) throw applicationError

    return { data: { ...candidate, ...application }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateCandidate(id: string, updates: any) {
  if (!isSupabaseConfigured()) {
    const candidateIndex = mockData.candidates.findIndex((candidate) => candidate.id === id)
    if (candidateIndex !== -1) {
      mockData.candidates[candidateIndex] = { ...mockData.candidates[candidateIndex], ...updates }
      return { data: mockData.candidates[candidateIndex], error: null }
    }
    return { data: null, error: { message: "Candidate not found" } }
  }

  const { data, error } = await supabase!
    .from("applications")
    .update(updates)
    .eq("candidate_id", id)
    .select(`
      *,
      candidates (*),
      jobs (title)
    `)
    .single()
  return { data, error }
}

export async function deleteCandidate(id: string) {
  if (!isSupabaseConfigured()) {
    const candidateIndex = mockData.candidates.findIndex((candidate) => candidate.id === id)
    if (candidateIndex !== -1) {
      mockData.candidates.splice(candidateIndex, 1)
      return { error: null }
    }
    return { error: { message: "Candidate not found" } }
  }

  const { error } = await supabase!.from("candidates").delete().eq("id", id)
  return { error }
}

// Activities
export async function getActivities() {
  if (!isSupabaseConfigured()) {
    return { data: mockData.activities, error: null }
  }

  const { data, error } = await supabase!
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)
  return { data, error }
}

export async function createActivity(activity: any) {
  if (!isSupabaseConfigured()) {
    const newActivity = {
      id: Date.now().toString(),
      ...activity,
      created_at: new Date().toISOString(),
    }
    mockData.activities.unshift(newActivity)
    return { data: newActivity, error: null }
  }

  const { data, error } = await supabase!.from("activities").insert([activity]).select().single()
  return { data, error }
}

// Dashboard stats
export async function getDashboardStats() {
  if (!isSupabaseConfigured()) {
    const totalJobs = mockData.jobs.length
    const totalCandidates = mockData.candidates.length
    const approvedCandidates = mockData.candidates.filter((c) => c.status === "approved" || c.status === "hired").length
    const pendingCandidates = mockData.candidates.filter((c) => c.status === "pending").length

    return {
      data: {
        totalJobs,
        totalCandidates,
        approvedCandidates,
        pendingCandidates,
      },
      error: null,
    }
  }

  try {
    const [jobsResult, candidatesResult, applicationsResult] = await Promise.all([
      supabase!.from("jobs").select("id", { count: "exact", head: true }),
      supabase!.from("candidates").select("id", { count: "exact", head: true }),
      supabase!.from("applications").select("status"),
    ])

    const applications = applicationsResult.data || []
    const approvedCandidates = applications.filter((app) => app.status === "approved" || app.status === "hired").length
    const pendingCandidates = applications.filter((app) => app.status === "pending").length

    return {
      data: {
        totalJobs: jobsResult.count || 0,
        totalCandidates: candidatesResult.count || 0,
        approvedCandidates,
        pendingCandidates,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}

// Settings
export async function getSettings() {
  if (!isSupabaseConfigured()) {
    return {
      data: [
        {
          key: "analysis_criteria",
          value: { keywords_weight: 40, experience_weight: 30, education_weight: 20, skills_weight: 10 },
        },
        {
          key: "theme",
          value: { mode: "light", primary_color: "#B91C1C", secondary_color: "#D97706" },
        },
      ],
      error: null,
    }
  }

  const { data, error } = await supabase!.from("settings").select("*")
  return { data, error }
}

export async function updateSettings(settings: any[]) {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  try {
    for (const setting of settings) {
      const { error } = await supabase!.from("settings").upsert(setting, { onConflict: "key" })
      if (error) throw error
    }
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function resetSettings() {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  const { error } = await supabase!.from("settings").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  return { error }
}
