import React, { useState } from "react"
import { supabase } from "../../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../style.css"
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import logoHorizontal from "../../../assets/logoHorizontal.png";

export default function DecorationVibePreferenceScreen() {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const options = [
    "Aconchegante",
    "Instagramável",
    "História do casal",
    "Floral abundante",
    "Estilo minimalista",
    "Outro",
  ]

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // 1. pega usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // 2. busca casamento do usuário
      const { data: casamento, error: casamentoError } = await supabase
        .from("casamento")
        .select("id_casamento, id_preferencias")
        .eq("id_usuario", user.id)
        .single()

      if (casamentoError || !casamento) throw new Error("Casamento não encontrado")

      let idPreferencias = casamento.id_preferencias

      if (idPreferencias) {
        // 3a. atualiza se já existir
        const { error: updateError } = await supabase
          .from("preferencias")
          .update({ decoracao: selectedOptions })
          .eq("id_preferencias", idPreferencias)

        if (updateError) throw updateError
      } else {
        // 3b. cria se ainda não existir
        const { data: novaPref, error: insertError } = await supabase
          .from("preferencias")
          .insert([{ decoracao: selectedOptions }])
          .select("id_preferencias")
          .single()

        if (insertError) throw insertError

        idPreferencias = novaPref.id_preferencias

        // vincula ao casamento
        const { error: linkError } = await supabase
          .from("casamento")
          .update({ id_preferencias: idPreferencias })
          .eq("id_casamento", casamento.id_casamento)

        if (linkError) throw linkError
      }

      setMessage("✅ Preferência de decoração salva com sucesso!")

      // 🔹 redireciona para convites
      navigate("/set/preferences/invitation")

    } catch (err) {
      setMessage("Erro: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="tela">
      <h2>
        Qual a vibe de vocês para a decoração do casamento?
      </h2>
      <form onSubmit={handleSubmit}>
        {options.map((option, index) => (
          <label
            key={index}
            className="labelCheckbox"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleSelect(option)}
              className="checkbox"
            />
            <span>{option}</span>
          </label>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="btn btnBg"
        >
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-[#A94F1A] font-medium">{message}</p>
      )}
    </div>
  )
}
