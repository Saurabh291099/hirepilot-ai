"use client";

import { FormEvent, useEffect, useState } from "react";

type Step = "register" | "login" | "onboarding" | "jobs" | "dashboard";
type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  remoteType: string;
  salary: string;
  posted: string;
  matchScore: number;
  skills: string[];
  source: string;
  applyUrl: string;
};
type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  date: string;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function Home() {
  const [step, setStep] = useState<Step>("register");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [profile, setProfile] = useState({
    title: "Frontend Engineer",
    locations: "Noida, Gurgaon",
    experience: "3 years",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function request(path: string, options?: RequestInit) {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("jobpilot.accessToken")
        : null;
    const headers = new Headers(options?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Something went wrong");
    return data;
  }

  function showError(value: unknown) {
    setError(value instanceof Error ? value.message : "Something went wrong");
  }

  async function register(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const authUser = await request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      window.localStorage.setItem("jobpilot.accessToken", authUser.token);
      setStep("onboarding");
    } catch (value) {
      showError(value);
    } finally {
      setBusy(false);
    }
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const authUser = await request("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      window.localStorage.setItem("jobpilot.accessToken", authUser.token);
      await openDashboard();
    } catch (value) {
      showError(value);
    } finally {
      setBusy(false);
    }
  }

  async function finishOnboarding(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (resume) {
        const body = new FormData();
        body.append("resume", resume);
        await request("/resumes", { method: "POST", body });
      }
      await openJobs();
    } catch (value) {
      showError(value);
    } finally {
      setBusy(false);
    }
  }

  async function openJobs() {
    const [liveJobData, demoJobData, applicationData] = await Promise.all([
      request("/jobs/live"),
      request("/jobs"),
      request("/applications"),
    ]);
    setJobs(liveJobData.length ? liveJobData : demoJobData);
    setApplications(applicationData);
    setStep("jobs");
  }
  async function openDashboard() {
    const applicationData = await request("/applications");
    setApplications(applicationData);
    setStep("dashboard");
  }

  async function applyToJob(job: Job) {
    setBusy(true);
    setError("");
    try {
      const application = await request("/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: job.company,
          role: job.title,
          status: "Applied",
        }),
      });
      setApplications((current) => [application, ...current]);
      window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    } catch (value) {
      showError(value);
    } finally {
      setBusy(false);
    }
  }

  if (step === "register" || step === "login")
    return (
      <AuthScreen
        mode={step}
        user={step === "register" ? user : login}
        setUser={(value) => {
          if (step === "register") setUser(value as typeof user);
          else setLogin(value as typeof login);
        }}
        onSubmit={step === "register" ? register : signIn}
        busy={busy}
        error={error}
        switchMode={() => {
          setError("");
          setStep(step === "register" ? "login" : "register");
        }}
      />
    );
  if (step === "onboarding")
    return (
      <Onboarding
        profile={profile}
        setProfile={(value) => setProfile(value as typeof profile)}
        resume={resume}
        setResume={setResume}
        onSubmit={finishOnboarding}
        busy={busy}
        error={error}
      />
    );
  if (step === "jobs")
    return (
      <JobsScreen
        jobs={jobs}
        applications={applications}
        applyToJob={applyToJob}
        busy={busy}
        onDashboard={openDashboard}
      />
    );
  return <Dashboard applications={applications} onJobs={openJobs} />;
}

function AuthScreen({
  mode,
  user,
  setUser,
  onSubmit,
  busy,
  error,
  switchMode,
}: {
  mode: "register" | "login";
  user: Record<string, string>;
  setUser: (value: Record<string, string>) => void;
  onSubmit: (event: FormEvent) => void;
  busy: boolean;
  error: string;
  switchMode: () => void;
}) {
  const isRegister = mode === "register";
  return (
    <main className="auth-page">
      <div className="auth-visual">
        <div className="brand">
          <span>H</span> HirePilot
        </div>
        <div>
          <p className="eyebrow">Your unfair advantage</p>
          <h1>Find work that fits the person you are becoming.</h1>
          <p>
            Upload your resume once. HirePilot understands your strengths and
            finds the roles worth your time.
          </p>
        </div>
        <div className="quote">
          “The best job search is the one that feels personal.”
        </div>
      </div>
      <section className="auth-card">
        <p className="eyebrow">
          {isRegister ? "Start your search" : "Welcome back"}
        </p>
        <h2>
          {isRegister ? "Build your job cockpit" : "Sign in to HirePilot"}
        </h2>
        <p className="subcopy">
          {isRegister
            ? "Your next opportunity starts with a clear profile."
            : "Pick up where your search left off."}
        </p>
        <form onSubmit={onSubmit}>
          {isRegister && (
            <div className="form-row">
              <label>
                First name
                <input
                  required
                  value={user.firstName ?? ""}
                  onChange={(event) =>
                    setUser({ ...user, firstName: event.target.value })
                  }
                  placeholder="Saurabh"
                />
              </label>
              <label>
                Last name
                <input
                  required
                  value={user.lastName ?? ""}
                  onChange={(event) =>
                    setUser({ ...user, lastName: event.target.value })
                  }
                  placeholder="Sharma"
                />
              </label>
            </div>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={user.email ?? ""}
              onChange={(event) =>
                setUser({ ...user, email: event.target.value })
              }
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={isRegister ? 8 : 1}
              value={user.password ?? ""}
              onChange={(event) =>
                setUser({ ...user, password: event.target.value })
              }
              placeholder={
                isRegister ? "At least 8 characters" : "Your password"
              }
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary wide" disabled={busy}>
            {busy
              ? "Please wait..."
              : isRegister
                ? "Create my account →"
                : "Sign in →"}
          </button>
        </form>
        <p className="switch-copy">
          {isRegister ? "Already have an account?" : "New to HirePilot?"}{" "}
          <button className="text-button" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}

function Onboarding({
  profile,
  setProfile,
  resume,
  setResume,
  onSubmit,
  busy,
  error,
}: {
  profile: Record<string, string>;
  setProfile: (value: Record<string, string>) => void;
  resume: File | null;
  setResume: (value: File | null) => void;
  onSubmit: (event: FormEvent) => void;
  busy: boolean;
  error: string;
}) {
  return (
    <main className="flow-page">
      <div className="flow-header">
        <div className="brand">
          <span>H</span> HirePilot
        </div>
        <span>Step 1 of 2</span>
      </div>
      <section className="onboarding-card">
        <p className="eyebrow">Let’s make this personal</p>
        <h1>Tell us what you’re looking for.</h1>
        <p className="subcopy">
          Upload your resume for the fastest setup, or describe your target role
          below. You can edit everything later.
        </p>
        <form onSubmit={onSubmit}>
          <div className="resume-drop">
            <span className="upload-icon">↑</span>
            <div>
              <b>{resume ? resume.name : "Upload your latest resume"}</b>
              <small>PDF or DOCX · Max 10MB</small>
            </div>
            <label className="secondary">
              {resume ? "Change file" : "Choose file"}
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setResume(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <div className="or">
            <span>or add details manually</span>
          </div>
          <div className="form-row">
            <label>
              Target role
              <input
                required
                value={profile.title}
                onChange={(event) =>
                  setProfile({ ...profile, title: event.target.value })
                }
              />
            </label>
            <label>
              Experience
              <input
                required
                value={profile.experience}
                onChange={(event) =>
                  setProfile({ ...profile, experience: event.target.value })
                }
              />
            </label>
          </div>
          <label>
            Preferred locations
            <input
              required
              value={profile.locations}
              onChange={(event) =>
                setProfile({ ...profile, locations: event.target.value })
              }
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary wide" disabled={busy}>
            {busy ? "Reading your profile..." : "Find my matching jobs →"}
          </button>
        </form>
      </section>
    </main>
  );
}

function JobsScreen({
  jobs,
  applications,
  applyToJob,
  busy,
  onDashboard,
}: {
  jobs: Job[];
  applications: Application[];
  applyToJob: (job: Job) => void;
  busy: boolean;
  onDashboard: () => void;
}) {
  return (
    <main className="jobs-page">
      <header className="jobs-header">
        <div className="brand">
          <span>H</span> HirePilot
        </div>
        <div>
          <button className="secondary" onClick={onDashboard}>
            My applications ({applications.length})
          </button>
          <span className="avatar">SS</span>
        </div>
      </header>
      <section className="jobs-intro">
        <p className="eyebrow">Personalized for you</p>
        <h1>Jobs worth your attention.</h1>
        <p>
          Fresh roles ranked by how well they match your profile, skills, and
          preferences.
        </p>
      </section>
      <div className="jobs-toolbar">
        <b>{jobs.length} strong matches</b>
        <span>Best match　⌄</span>
      </div>
      <section className="job-list">
        {jobs.map((job) => (
          <article className="job-card" key={job.id}>
            <div className="job-card-top">
              <span className="company-logo large">{job.company[0]}</span>
              <div>
                <p>
                  {job.company} <small>· {job.source}</small>
                </p>
                <h2>{job.title}</h2>
                <span className="job-meta">
                  {job.location} · {job.remoteType} · {job.salary}
                </span>
              </div>
              <div className="match-score">
                <strong>{job.matchScore}%</strong>
                <span>Match</span>
              </div>
            </div>
            <div className="job-card-bottom">
              <div className="skill-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
                <small>{job.posted}</small>
              </div>
              <div>
                <button className="save-button" aria-label="Save job">
                  ♡
                </button>
                <button
                  className="primary apply-button"
                  disabled={busy}
                  onClick={() => void applyToJob(job)}
                >
                  Apply on employer site →
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function Dashboard({
  applications,
  onJobs,
}: {
  applications: Application[];
  onJobs: () => void;
}) {
  return (
    <main className="dashboard-finish">
      <div className="brand">
        <span>H</span> HirePilot
      </div>
      <p className="eyebrow">Your search, at a glance</p>
      <h1>You’re moving forward.</h1>
      <p className="subcopy">
        Every application has a next step. Keep the momentum going.
      </p>
      <section className="finish-stats">
        <article>
          <strong>{applications.length}</strong>
          <span>Applications tracked</span>
        </article>
        <article>
          <strong>
            {applications.filter((item) => item.status === "Interview").length}
          </strong>
          <span>Interviews</span>
        </article>
        <article>
          <strong>76%</strong>
          <span>Average match score</span>
        </article>
      </section>
      <div className="finish-list">
        <h2>Recent applications</h2>
        {applications.map((application) => (
          <div key={application.id}>
            <span className="company-logo">{application.company[0]}</span>
            <b>{application.company}</b>
            <span>{application.role}</span>
            <em>{application.status}</em>
          </div>
        ))}
      </div>
      <button className="primary" onClick={onJobs}>
        Find more matching jobs →
      </button>
    </main>
  );
}
