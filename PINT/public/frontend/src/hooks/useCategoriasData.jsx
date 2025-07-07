import { useEffect, useState } from "react";
import axios from "axios";

export function useCategoriasData() {
    const [todasCategorias, setTodasCategorias] = useState([]);
    const [todasAreas, setTodasAreas] = useState([]);
    const [todasTopicos, setTodasTopicos] = useState([]);

    useEffect(() => {
        axios.get("https://pint-web-htw2.onrender.com/categoria/list")
            .then(res => { if (res.data.success) setTodasCategorias(res.data.data); });
        axios.get("https://pint-web-htw2.onrender.com/area/list")
            .then(res => { if (res.data.success) setTodasAreas(res.data.data); });
        axios.get("https://pint-web-htw2.onrender.com/topico-curso/list")
            .then(res => { if (res.data.success) setTodasTopicos(res.data.data); });
    }, []);

    return { todasCategorias, todasAreas, todasTopicos };
}