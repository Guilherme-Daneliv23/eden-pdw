import { useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "./style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../assets/logoHorizontal.png";

export default function GroomsScreen() {
  const [noivo1, setNoivo1] = useState({
    nome: "",
    sobrenome: "",
    idade: "",
    sexo: "",
  })

  const [noivo2, setNoivo2] = useState({
    nome: "",
    sobrenome: "",
    idade: "",
    sexo: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleChange = (index, field, value) => {
    if (index === 1) {
      setNoivo1({ ...noivo1, [field]: value })
    } else {
      setNoivo2({ ...noivo2, [field]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // busca o casamento desse usuário
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      // insere os dois noivos
      const { data: insertedNoivos, error: insertError } = await supabase
        .from("noivos")
        .insert([noivo1, noivo2])
        .select()

      if (insertError) throw insertError

      // atualiza o casamento com os IDs dos noivos
      const { error: updateError } = await supabase
        .from("casamento")
        .update({
          id_noivo1: insertedNoivos[0].id_noivo,
          id_noivo2: insertedNoivos[1].id_noivo
        })
        .eq("id_casamento", casamento.id_casamento)

      if (updateError) throw updateError

      setMessage("Noivos cadastrados com sucesso!")

      // redireciona para próxima tela
      navigate("/set/general-data-wedding")

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
        <h2>Cadastro dos Noivos</h2>
        <form className="forms" onSubmit={handleSubmit}>
          {[noivo1, noivo2].map((noivo, index) => (
            <div key={index}>
              <h3>Noivo {index + 1}</h3>
              <input
                type="text"
                placeholder="Nome"
                value={noivo.nome}
                onChange={(e) => handleChange(index + 1, "nome", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Sobrenome"
                value={noivo.sobrenome}
                onChange={(e) => handleChange(index + 1, "sobrenome", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Idade"
                value={noivo.idade}
                onChange={(e) => handleChange(index + 1, "idade", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Sexo"
                value={noivo.sexo}
                onChange={(e) => handleChange(index + 1, "sexo", e.target.value)}
                required
              />
            </div>
          ))}

          <button className="btn btnBg" type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Noivos"}
          </button>
        </form>
      </div>
      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  )
}
