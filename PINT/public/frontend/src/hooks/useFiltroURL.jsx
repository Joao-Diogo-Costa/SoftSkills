import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFiltroURL(setCategoriaSelecionada, setAreaSelecionada, setTopicoSelecionado, setOrdenarPor) {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const topicoParam = params.get("topico");
        const areaParam = params.get("area");
        const categoriaParam = params.get("categoria");
        const ordenarPorParam = params.get("ordenarPor");

        if (topicoParam) {
            setTopicoSelecionado(topicoParam);
            setAreaSelecionada("");
            setCategoriaSelecionada("");
        } else if (areaParam) {
            setAreaSelecionada(areaParam);
            setTopicoSelecionado("");
            setCategoriaSelecionada("");
        } else if (categoriaParam) {
            setCategoriaSelecionada(categoriaParam);
            setTopicoSelecionado("");
            setAreaSelecionada("");
        } else {
            setTopicoSelecionado("");
            setAreaSelecionada("");
            setCategoriaSelecionada("");
        }

        if (ordenarPorParam === "popularidade" || ordenarPorParam === "data") {
            setOrdenarPor(ordenarPorParam);
        } else {
            setOrdenarPor("");
        }
    }, [location.search, setCategoriaSelecionada, setAreaSelecionada, setTopicoSelecionado, setOrdenarPor]);
}