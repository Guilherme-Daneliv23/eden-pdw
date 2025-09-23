import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function SignInScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage("❌ Erro: " + error.message)
    } else {
      setMessage("✅ Login realizado com sucesso!")
      console.log("Sessão:", data.session)
      // Se quiser redirecionar após login, pode usar navigate("/rota")
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10, width: "100%" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>Não tem conta?</p>
        <button
          onClick={() => navigate("/signup")}
          style={{ padding: 10, marginTop: 8, width: "100%", background: "#4CAF50", color: "white", border: "none", borderRadius: 4 }}
        >
          Cadastre-se
        </button>
      </div>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
