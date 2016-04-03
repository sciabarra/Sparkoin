package spatutorial.client.modules

import diode.react._
import diode.data.Pot
import japgolly.scalajs.react.ReactComponentB
import japgolly.scalajs.react.extra.router.RouterCtl
import japgolly.scalajs.react.vdom.prefix_<^._
import spatutorial.client.SPAMain.{Loc, TodoLoc}
import spatutorial.client.components._
import spatutorial.client.services.RootModel

object Dashboard {

  case class Props(router: RouterCtl[Loc], proxy: ModelProxy[Pot[String]])

  // create dummy data for the chart
  val cp = Chart.ChartProps("Test chart", Chart.BarChart, ChartData(Seq("A", "B", "C"), Seq(ChartDataset(Seq(1, 2, 3), "Data1"))))

  // create the React component for Dashboard
  private val component = ReactComponentB[Props]("Dashboard")
    .render_P { case Props(router, proxy) =>
      <.div(
        // header, MessageOfTheDay and chart components
        <.h2("Dashboard"),
        // use connect from ModelProxy to give Motd only partial view to the model
        proxy.connect(m => m)(Motd(_)),
        Chart(cp),
        // create a link to the To Do view
        <.div(router.link(TodoLoc)("Check your todos!"))
      )
    }.build

  def apply(router: RouterCtl[Loc], proxy: ModelProxy[Pot[String]]) = component(Props(router, proxy))
}
