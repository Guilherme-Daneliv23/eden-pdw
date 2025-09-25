import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../assets/logoHorizontal.png";

export default function InvestmentPriorityPreferenceScreen() {
  const [selectedOption, setSelectedOption] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const options = [
    "Festa",
    "Recepção",
    "Cerimônia",
    "Fotografia",
    "Vestuário",
    "Outro",
  ]

  const handleSelect = (option) => {
    setSelectedOption(option) // apenas um selecionado
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 1. Pega usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 2. Busca casamento
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // 3a. Atualiza
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ investimento_prioridade: selectedOption })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // 3b. Cria e vincula
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ investimento_prioridade: selectedOption }])
          .select("id_preferencias")
          .single()

        if (insertError) throw insertError

        idPreferencias = novaPref.id_preferencias

        const { error: linkError } = await supabase
          .from("casamento")
          .update({ id_preferencias: idPreferencias })
          .eq("id_casamento", casamento.id_casamento)

        if (linkError) throw linkError
      }

      setMessage("Prioridade de investimento salva com sucesso!")

      // 🔹 Redireciona para a próxima tela
      navigate("/set/preferences/drinks")

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

      <div className="area">        
        <h3>O maior investimento será em qual parte?</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {options.map((option) => (
            <label
              key={option}
              className={`flex items-center px-4 py-3 rounded-xl border cursor-pointer ${
                selectedOption === option
                  ? "bg-rosa-escuro-50"
                  : "bg-rosa-claro"
              }`}
            >
              <input
                type="radio"
                name="investment"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleSelect(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}

          <button
            type="submit"
            disabled={loading || !selectedOption}
            className="btn btnBg"
          >
            {loading ? "Salvando..." : "Salvar investimento"}
          </button>
        </form>
      </div>
      <img className="logoHorizontal" src={logoHorizontal} alt="Logo Éden"/>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  )
}
