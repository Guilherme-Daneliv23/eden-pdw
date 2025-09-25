import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "./style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../assets/logoHorizontal.png";

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      })

      if (error) throw error

      const user = data.user
      if (!user) throw new Error("Não foi possível obter o usuário após o cadastro.")

      const { error: insertError } = await supabase
        .from("casamento")
        .insert([
          {
            id_usuario: user.id,
            id_orcamento: null,
            id_convidados: null,
            id_noivo1: null,
            id_noivo2: null,
            id_preferencias: null,
            id_data: null
          }
        ])

      if (insertError) throw insertError

      setMessage("Conta criada, sessão iniciada e casamento iniciado!")

      setTimeout(() => navigate("/set/grooms"), 1200)

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="tela">
      <select
        className="idioma"
      >
        <option value="idioma1">Português (Brasil)</option>
      </select>

      <div className="areaForms">
        <h2>Bem-vindos,<br/>noivos!</h2>

        <form onSubmit={handleSignUp}>
          <div className="inputBox">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Email</label>
          </div>

          <div className="inputBox">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder=" "
            />
            <label>Senha</label>
          </div>
          <button className="btn btnBg" type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
      <button className="btn btnT" onClick={() => navigate("/")}>
          Já tenho uma conta
      </button>

      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
