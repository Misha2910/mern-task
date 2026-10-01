import { useState } from "react";
import { ArrowRight, Check, Layers3 } from "lucide-react";
import { authApi } from "./api/auth.api.js";
import Button from "./components/Button.jsx";
import { Field } from "./components/Field.jsx";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";
  function updateField(event) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authApi[mode]({
        ...(isRegister ? { name: values.name.trim() } : {}),
        email: values.email.trim(),
        password: values.password,
      });
      onAuthenticated(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <section className="auth-shell">
        <div className="auth-brand-row">
          <span className="brand-mark">
            <Layers3 size={19} />
          </span>
          <span>
            Folio<span className="brand-period">.</span>
          </span>
          <span className="auth-private">
            <span /> PRIVATE WORKSPACE
          </span>
        </div>
        <div className="auth-content">
          <div className="auth-intro">
            <p className="eyebrow">YOUR WORK, IN GOOD ORDER</p>
            <h1>
              Make room
              <br />
              for <em>momentum.</em>
            </h1>
            <p className="auth-description">
              A considered space for the projects you care about and the next
              steps that move them forward.
            </p>
            <div className="auth-points">
              <span>
                <Check size={15} /> Projects that stay focused
              </span>
              <span>
                <Check size={15} /> Tasks with a clear next step
              </span>
              <span>
                <Check size={15} /> Your work, yours alone
              </span>
            </div>
          </div>
          <form className="auth-form" onSubmit={submit}>
            <p className="eyebrow">
              {isRegister ? "GET STARTED" : "WELCOME BACK"}
            </p>
            <h2>{isRegister ? "Create your account" : "Sign in to Folio"}</h2>
            <p className="form-subtitle">
              {isRegister
                ? "A little structure goes a long way."
                : "Pick up right where you left off."}
            </p>
            {isRegister && (
              <Field
                id="name"
                label="Your name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={updateField}
                required
                maxLength={80}
              />
            )}
            <Field
              id="email"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={updateField}
              required
              maxLength={254}
            />
            <Field
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={values.password}
              onChange={updateField}
              required
              minLength={isRegister ? 8 : 1}
              maxLength={128}
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button
              className="auth-submit"
              type="submit"
              loading={loading}
              icon={ArrowRight}
            >
              {isRegister ? "Create account" : "Sign in"}
            </Button>
            <p className="auth-switch">
              {isRegister ? "Already have an account?" : "New to Folio?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setValues({ name: "", email: "", password: "" });
                  setMode(isRegister ? "login" : "register");
                }}
              >
                {isRegister ? "Sign in" : "Create an account"}
              </button>
            </p>
          </form>
        </div>
        <footer className="auth-footer">
          <span>Folio Workspace</span>
          <span>Keep the important things moving.</span>
        </footer>
      </section>
    </main>
  );
}
