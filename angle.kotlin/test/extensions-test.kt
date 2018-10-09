//import com.beust.klaxon.*
//import okhttp3
import com.pannous.angle.parse
//import com.pannous.mark.parse as mark
import com.pannous.extensions.*
//import com.pannous.netbase.*
import org.w3c.dom.Node
import kotlin.collections.mutableMapOf as map

//var api="https://api.duckduckgo.com/?q=DuckDuckGo&format=xml"
private var api = "http://de.netbase.pannous.com:8080/xml/verbose/hi"
//var api="https://api.duckduckgo.com/?q=DuckDuckGo&format=json"

/*   <entry n="3">
        <w gloss="1a" lemma="אֵב" morph="n-m" POS="abe" xlit="ʼêb" ID="H3" xml:lang="heb">אב</w>
        <foreign xml:lang="grc">
          <w gloss="G:1080" />
          <w gloss="G:2590" />
          <w gloss="G:4491" />
        </foreign>
        <list>
          <item>1) freshness,  fresh green,  green shoots,  or greenery</item>
        </list>
*/
fun main(args: Array<String>) {
//	testNetbase()
//	testXml()
	testMark()
}

fun testMark() {
	api=api.replace("xml","json")
	var json = wget(api)
	var data = parse(json) //as Json
	log(data["results"])

//	var data = mark.parse(json)
//	log(data["results"])
}


fun testXml(){

//    var xml=download(api)
	val file = "/me/uruk_egypt/dicts/strongs/hebrew/StrongHebrewG.xml"
//	var xml= InputStreamReader(FileInputStream(File(file)), "UTF-8").readText() FUCK JAVA!!!
//	var xml= File(file).readText() FUCK JAVA!!!MalformedByteSequenceException: Invalid byte 1 of 1-byte UTF-8 sequence.
//	print(xml)
//	val root=Xml(xml) //URL(api))
	val root = Xml(file)
	for (e in root["entry"]) {
		var w = e["w"]
		col(w.text)
		col(w["lemma"].text)
		col(w["xlit"].text)
		col("?")

//		printNotes(e)
		for (f in e["list"].."item")
			col(f.text)

		println()


//		for (f in e.."foreign") // <w gloss="G:970" />
//			log(f["w"]["gloss"].text)
	}
//	val root=Xml(URL("file://"+file))
//	val root=Xml(URL(api2))
	// 	root.normalizeDocument()
}
fun col(text: String) {
	print(text+"\t")
}

fun printNotes(e: Node) {
	var notes=map<String,String>()
	for (f in e.."note") { // <note type="exegesis">probably for…
		notes[f["type"]+""]=f.text
//			log(f["type"] + " " + f.text
		log(f["type"].v)
		log(f.text)
	}
	print(notes["exegesis"])
	print(notes["explanation"])
	print(notes["translation"])
}


