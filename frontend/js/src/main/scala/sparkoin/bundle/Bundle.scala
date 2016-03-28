package sparkoin.bundle

/**
  * Created by msciab on 28/03/16.
  */
import scala.scalajs.js

@js.native
object Bundle extends js.Object {
  def jquery : js.Function1[js.Any, Jquery] = js.native
  def lodash: Lodash = js.native
}

@js.native
trait Jquery extends js.Object {
  def text(arg: js.Any): Jquery = js.native
}

@js.native
trait Lodash extends js.Object {
  def camelCase(arg: js.Any): String = js.native
}

