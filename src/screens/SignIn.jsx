import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "./style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../assets/logoHorizontal.png"; 

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

    if(error) {
      setMessage("Erro: " + error.message)
    } else {
      setMessage("Login realizado com sucesso!")
      console.log("Sessão:", data.session)
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
      
      <div className="area areaLoginCadastro">
        <h2>Que bom vê-los,<br/>noivos!</h2>

        <form onSubmit={handleLogin}>
          <div className="inputBox">
            <input 
              className="inputText"
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
              className="inputText"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Senha</label>
          </div>

          <button className="btn btnBg" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button className="btn btnT" onClick={() => navigate("/signup")}>
          Criar nova conta
        </button>

        <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

        {message && <p style={{ marginTop: 20 }}>{message}</p>}
      </div>
    </div>
  )
}