import { tRichieste } from "@/lib/definitions";
import { Card } from "./ui/card";

const RichiestaCard = ({ richiesta }: { richiesta: tRichieste }) => {
    return (
        <Card className="w-full my-2 p-3 flex">
            <div className="w-1/12">
                {richiesta.RichiestaID}
            </div>
            <div className="w-4/12">
                {richiesta.CognomeNomeRichiedente}
            </div>
            <div className="w-4/12">
                {richiesta.DataInserimentoRichiesta.toString()}
            </div>
            <div className="w-2/12">
                {richiesta.Importo}
            </div>
            <div className="w-1/12">
                {richiesta.NumeroRate}
            </div>
        </Card>
    )
}

export default RichiestaCard