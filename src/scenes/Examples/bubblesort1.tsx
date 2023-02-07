import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Text } from '@motion-canvas/2d/lib/components/'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { Colors } from '../../styles'
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';

export default makeScene2D(function* (view) {
    const Elements: Rect[] = [];
    const Text_: Text[] = [];
    const Array1 = [6, 5, 3, 1, 8, 7, 2];

    const textStyle = {
        fontSize: 60,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    for(let i = 0; i < Array1.length; i++){
        view.add(
            <Rect
                opacity={0}
                ref={makeRef(Elements, i)}
                height={128}
                width={128}
                lineWidth={8}
                radius={new Spacing(4)}
                stroke={'#242424'}
                
                x={-((Array1.length * (128 + 28)) / 2) + i * (128 + 28) + (128 + 28) / 2 }
            >
                <Text ref={makeRef(Text_, i)} text={Array1[i].toString()} {...textStyle} />
            </Rect>
        )
    }
    yield* waitUntil('Begin');
    for(let i = 0; i < Array1.length; i++){
        Elements[i].position.y(-50);
        yield* all(
            tween(.5, y => {
                Elements[i].position(
                    Vector2.lerp(
                        new Vector2(Elements[i].position.x(), Elements[i].position.y()),
                        new Vector2(Elements[i].position.x(), 0),
                        easeInOutCubic(y),
                    )
                )
            }),
            Elements[i].opacity(1, .5),
        )
    }
    yield* waitUntil('Beginning');
    yield* HighLight(Elements[0], .5);

    yield* Step(0, 1, Elements, Text_, Array1, true);
    yield* Step(1, 2, Elements, Text_, Array1, true);
    yield* Step(2, 3, Elements, Text_, Array1, true);
    yield* Step(3, 4, Elements, Text_, Array1, false);
    yield* Step(4, 5, Elements, Text_, Array1, true);
    yield* Step(5, 6 , Elements, Text_, Array1, true);

    yield* waitUntil('Largest');
    yield* tween(0.5, color =>{
        Elements[6].stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.green), 
                easeInOutCubic(color),
            )
        )
    })

    yield* waitUntil('Bubblesort');
    for(let i = 0; i < Array1.length-i+2; i++){
        for(let j = 0; j < Array1.length-i-2; j++){
            if(Array1[j] > Array1[j+1]){
                yield* StepBubble(j, j+1, Elements, Text_, Array1, true);
            } else yield* StepBubble(j, j+1, Elements, Text_, Array1, false);
        }
        yield* tween(0.5, color =>{
            Elements[Array1.length-i-2].stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.green), 
                    easeInOutCubic(color),
                )
            )
        })
    }
    yield* tween(0.5, color =>{
        Elements[0].stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.green), 
                easeInOutCubic(color),
            )
        )
    })

    yield* waitUntil('NNDSxt');

    yield* waitFor(10);
})

function* Swap(Element1: number, Element2: number, Elements: Rect[], Text: Text[], Array: number[]){
    const E1 = Elements[Element1].absolutePosition();
    const E2 = Elements[Element2].absolutePosition();
    yield* all(
        Elements[Element1].absolutePosition(E2, 1),
        Elements[Element2].absolutePosition(E1, 1),
    )

    let temp = Array[Element1];
    Array[Element1] = Array[Element2];
    Array[Element2] = temp;

    Elements[Element1].absolutePosition(E1);
    Elements[Element2].absolutePosition(E2);

    Text[Element1].text(Array[Element1].toString());
    Text[Element2].text(Array[Element2].toString());
}

function* HighLight(E: Rect, Duration: number){
    yield* tween(Duration, color =>{
        E.stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.blue), 
                easeInOutCubic(color),
            )
        )
    })
}

function* deHighLight(E: Rect, Duration: number){
    yield* tween(Duration, color =>{
        E.stroke(
            Color.lerp(
                new Color(Colors.blue),
                new Color('#242424'),
                easeInOutCubic(color),
            )
        )
    })
}

function* Step(First: number, Second: number, Elements: Rect[], Text_: Text[], Array: number[], makeSwap: boolean){
    yield* waitUntil('Compare[' + First.toString() + '-' + Second.toString() + ']');
    yield* HighLight(Elements[First], 0.5);
    yield* HighLight(Elements[Second], 0.5);
    if(makeSwap){
        yield* waitUntil('Swap2[' + First.toString() + '-' + Second.toString() + ']');
        yield* Swap(First, Second, Elements, Text_, Array);
    }
    yield* waitFor(.5)
    yield* all(
        deHighLight(Elements[First], .3),
        deHighLight(Elements[Second], .3),
    )
}

function* StepBubble(First: number, Second: number, Elements: Rect[], Text_: Text[], Array: number[], makeSwap: boolean){
    yield* HighLight(Elements[First], 0.5);
    yield* HighLight(Elements[Second], 0.5);
    if(makeSwap){
        yield* Swap(First, Second, Elements, Text_, Array);
    }
    yield* waitFor(.5)
    yield* all(
        deHighLight(Elements[First], .3),
        deHighLight(Elements[Second], .3),
    )
}