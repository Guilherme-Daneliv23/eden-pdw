import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function SignUpScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 1. Cria usuário e já inicia sessão
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin } // mantém a sessão
      })

      if (error) throw error

      const user = data.user
      if (!user) throw new Error("Não foi possível obter o usuário após o cadastro.")

      // 2. Cria um novo casamento vinculado a esse usuário
      const { error: insertError } = await supabase
        .from("casamento")
        .insert([
          {
            id_usuario: user.id, // FK para auth.users
            id_orcamento: null,
            id_convidados: null,
            id_noivo1: null,
            id_noivo2: null,
            id_preferencias: null,
            id_data: null
          }
        ])

      if (insertError) throw insertError

      setMessage("✅ Conta criada, sessão iniciada e casamento iniciado!")

      // 3. Redireciona para a próxima tela (exemplo: cadastro dos noivos)
      setTimeout(() => navigate("/set/grooms"), 1200)

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSignUp}>
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
            minLength={6}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: 10, width: "100%" }}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
