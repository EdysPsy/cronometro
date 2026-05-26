import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Volta {
  id: number;
  tempoFormatado: string;
}

export default function Index() {
  const [tempo, setTempo] = useState(0); // Tempo em centésimos de segundo
  const [correndo, setCorrendo] = useState(false);
  const [voltas, setVoltas] = useState<Volta[]>([]);

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  const iniciarCronometro = () => {
    if (!correndo) {
      setCorrendo(true);
      intervaloRef.current = setInterval(() => {
        setTempo((tempoAnterior) => tempoAnterior + 1);
      }, 10);
    }
  };

  const pausarCronometro = () => {
    if (correndo && intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
      setCorrendo(false);
    }
  };

  const resetarCronometro = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    setCorrendo(false);
    setTempo(0);
    setVoltas([]);
  };

  const registrarVolta = () => {
    if (tempo > 0) {
      const novaVolta: Volta = {
        id: voltas.length + 1,
        tempoFormatado: formatarTempo(tempo),
      };
      setVoltas([novaVolta, ...voltas]);
    }
  };

  const formatarTempo = (totalCentesimos: number) => {
    const minutos = Math.floor(totalCentesimos / 6000);
    const segundos = Math.floor((totalCentesimos % 6000) / 100);
    const centesimos = totalCentesimos % 100;

    const pad = (num: number) => String(num).padStart(2, "0");

    return `${pad(minutos)}:${pad(segundos)}.${pad(centesimos)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Cronômetro Avançado</Text>

      <View style={styles.displayContainer}>
        <Text style={styles.timerText}>{formatarTempo(tempo)}</Text>
      </View>

      <View style={styles.botaoContainer}>
        {!correndo ? (
          <TouchableOpacity style={[styles.botao, styles.botaoIniciar]} onPress={iniciarCronometro}>
            <Text style={styles.botaoTexto}>{tempo === 0 ? "Iniciar" : "Continuar"}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.botao, styles.botaoPausar]} onPress={pausarCronometro}>
            <Text style={styles.botaoTexto}>Pausar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.botao, styles.botaoVolta, { opacity: correndo ? 1 : 0.5 }]}
          onPress={registrarVolta}
          disabled={!correndo}
        >
          <Text style={styles.botaoTexto}>Volta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoReset]} onPress={resetarCronometro}>
          <Text style={styles.botaoTexto}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Histórico de Voltas</Text>
      <ScrollView style={styles.listaContainer} showsVerticalScrollIndicator={false}>
        {voltas.map((item) => (
          <View key={item.id} style={styles.itemVolta}>
            <Text style={styles.itemVoltaTexto}>Volta {item.id}</Text>
            <Text style={styles.itemVoltaTempo}>{item.tempoFormatado}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    paddingTop: 50,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 20,
  },
  displayContainer: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#38BDF8",
    marginBottom: 30,
    minWidth: "80%",
    alignItems: "center",
  },
  timerText: {
    fontSize: 48,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#38BDF8",
  },
  botaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  botao: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 3,
  },
  botaoIniciar: { backgroundColor: "#10B981" },
  botaoPausar: { backgroundColor: "#F59E0B" },
  botaoVolta: { backgroundColor: "#6366F1" },
  botaoReset: { backgroundColor: "#EF4444" },
  botaoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#94A3B8",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 10,
  },
  listaContainer: {
    width: "90%",
    flex: 1,
  },
  itemVolta: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemVoltaTexto: {
    color: "#94A3B8",
    fontSize: 16,
  },
  itemVoltaTempo: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "bold",
  },
});
