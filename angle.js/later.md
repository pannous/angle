
infixes
```
to get a list without an element:
    list-[the element]
```

precedence is specified like this:
```
plus < times
operator + precedes operator *
```

later:
expressions in comparisons are used symbolically and then evaluated.
```
x={kill}
y={kill}
z={no}
x == y  # true without anyone being killed
x == z  # true if kill returned false
```

problems(?)
list of functions vs folding
{x=x+y,x>1}(x=1,y=1)
a) x=2 => true
b) (x=2,false)
no problem: use xs=(x=x+y,x>1) for lists!
xs(x=1,y=1)
only explicyt via xs.apply_each() ?
general semantics of xs(ys) ??
(1,2,3)(4,5,6)=(4,10,18) ? LATER IF AT ALL!




Abstraktion
    Jedes Objekt im System kann als ein abstraktes Modell eines Akteurs betrachtet werden, der Aufträge erledigen, seinen Zustand berichten und ändern und mit den anderen Objekten im System kommunizieren kann, ohne offenlegen zu müssen, wie diese Fähigkeiten implementiert sind (vgl. abstrakter Datentyp). Solche Abstraktionen sind entweder Klassen (in der klassenbasierten Objektorientierung) oder Prototypen (in der prototypbasierten Programmierung).

    Klasse
        Die Datenstruktur eines Objekts wird durch die Attribute (auch Eigenschaften) seiner Klassendefinition festgelegt. Das Verhalten des Objekts wird von den Methoden der Klasse bestimmt. Klassen können von anderen Klassen abgeleitet werden (Vererbung). Dabei erbt die Klasse die Datenstruktur (Attribute) und die Methoden von der vererbenden Klasse (Basisklasse).
    Prototyp
        Objekte werden durch das Klonen bereits existierender Objekte erzeugt und können anderen Objekten als Prototypen dienen und damit ihre eigenen Methoden zur Wiederverwendung zur Verfügung stellen, wobei die neuen Objekte nur die Unterschiede zu ihrem Prototyp definieren müssen. Änderungen am Prototyp werden dynamisch auch an den von ihm abgeleiteten Objekten wirksam.

Datenkapselung
    Als Datenkapselung bezeichnet man in der Programmierung das Verbergen von Implementierungsdetails. Auf die interne Datenstruktur kann nicht direkt zugegriffen werden, sondern nur über definierte Schnittstellen. Objekte können den internen Zustand anderer Objekte nicht in unerwarteter Weise lesen oder ändern. Ein Objekt hat eine Schnittstelle, die darüber bestimmt, auf welche Weise mit dem Objekt interagiert werden kann. Dies verhindert das Umgehen von Invarianten des Programms.

Feedback
    Verschiedene Objekte kommunizieren über einen Nachricht-Antwort-Mechanismus, der zu Veränderungen in den Objekten führt und neue Nachrichtenaufrufe erzeugt. Dafür steht die Kopplung als Index für den Grad des Feedbacks.

Persistenz
    Objektvariablen existieren, solange die Objekte vorhanden sind und „verfallen“ nicht nach Abarbeitung einer Methode.

Polymorphie
    Fähigkeit eines Bezeichners, abhängig von seiner Verwendung unterschiedliche Datentypen anzunehmen. Verschiedene Objekte können auf die gleiche Nachricht unterschiedlich reagieren. Wird die Art der Reaktion auf die Nachricht erst zur Laufzeit aufgelöst, wird dies auch späte Bindung genannt.

Vererbung
    Vererbung heißt vereinfacht, dass eine abgeleitete Klasse die Methoden und Attribute der Basisklasse ebenfalls besitzt, also „erbt“. Somit kann die abgeleitete Klasse auch darauf zugreifen. Neue Arten von Objekten können auf der Basis bereits vorhandener Objektdefinitionen festgelegt werden. Es können neue Bestandteile hinzugenommen werden oder vorhandene überlagert werden.

Objekte

Objekt
    Ein Element, welches Funktionen, Methoden, Prozeduren, einen inneren Zustand, oder mehrere dieser Dinge besitzt.

Entität
    Ein Objekt, welches eine Identität besitzt, welche unveränderlich ist. Beispielsweise kann eine Person ihre Adresse, Telefonnummer oder Namen ändern, ohne zu einer anderen Person zu werden. Eine Person ist also eine Entität.[5]

Wertobjekt
    Ein Objekt, welches über seinen Wert definiert wird. Eine Telefonnummer, welche sich ändert, ist also eine andere Telefonnummer. Gleichartig ist eine Adresse, bei der sich lediglich die Hausnummer ändert, eine andere Adresse, selbst wenn alle anderen Daten gleich bleiben. Somit stellt eine Telefonnummer und eine Adresse keine Entität dar, sondern ein Wertobjekt.[5]

Eigenschaft
    Ein Bestandteil des Zustands eines Objekts. Hierbei kann es sich um eine Entität oder ein Wertobjekt handeln.

Dienst
    Ein Objekt, welches ein Verhalten (z. B. eine Geschäftslogik) in Form von Prozeduren, Funktionen oder Methoden implementiert. Das Service verwendet hierbei Entitäten oder Wertobjekte.[5]

Prozedur
    Verändert den Zustand eines Objektes, ohne einen Rückgabewert zu liefern. Eine Prozedur kann andere Objekte als Parameter entgegen nehmen.

Funktion
    Ordnet einer gegebenen Eingabe einen bestimmten Rückgabewert zu. Eine Funktion zeichnet sich insbesondere dadurch aus, dass sie nicht den Zustand eines Objekts verändert.[5]

Methode
    Verändert den Zustand eines Objekts und liefert zudem einen Rückgabewert. Eine Methode kann andere Objekte als Parameter entgegen nehmen.

Modul
    Eine zusammengefasste Gruppe von Objekten.
