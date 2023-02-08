import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Text } from '@motion-canvas/2d/lib/components/'
import { CodeBlock, edit, insert, lines, word }from '@motion-canvas/2d/lib/components/CodeBlock';
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { createRef, makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Direction, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { Colors } from '../../styles'
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';
import { slideTransition } from "@motion-canvas/core/lib/transitions";

export default makeScene2D(function* (view) {
    yield* slideTransition(Direction.Right, 1);

    const Array = [4, 5, 6, 1, 3, 4];
    const Elements: Rect[] = [];
    const Text_: Text[] = [];

    const Code = createRef<CodeBlock>();
    const ExampleText = createRef<Text>();

    const textStyle = {
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    view.add(
        <Text 
            ref={ExampleText}
            text={'EXAMPLE 2'}
            opacity={0}
            fontSize={100}
            lineHeight={100}
            {...textStyle}
        />
    )

    yield ExampleText().opacity(1 , .5)
    yield* waitFor(2);
    yield* ExampleText().opacity(0, .5)
    view.add(
        <Rect
            offset={-1}
            x={-1100}
            y={-540 + 80}
            height={1080 - 160}
            width={960}
            clip
        >
            <CodeBlock 
                ref={Code}
                fontSize={24}
                lineHeight={36}
                fontFamily={'JetBrains Mono'}
                opacity={0}
                code={'BubbleSort(Array, n)\n for(i=0; i < n; i++){\n   for(j=0; j < n-i-1; j++){\n     if(Array[j] > Array[j+1]){\n       Swap(Array[j], Array[j+1])\n     }\n   }\n }'}
            />
        </Rect>
    )

    for(let i = 0; i < Array.length; i++){
        view.add(
            <Rect
                opacity={0}
                ref={makeRef(Elements, i)}
                height={128}
                width={128}
                lineWidth={8}
                radius={new Spacing(4)}
                stroke={'#242424'}
    
                x={-((Array.length * (128 + 28)) / 2) + i * (128 + 28) + (128 + 28) / 2 + 300}
            >
                <Text 
                    ref={makeRef(Text_, i)} 
                    text={Array[i].toString()} 
                    fontSize={60} 
                    {...textStyle} 
                />
            </Rect>
        )
    }
    
    yield* waitUntil('Begin');
    for(let i = 0; i < Array.length; i++){
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
                
    yield* Code().opacity(1, 1); 
    
    yield* waitUntil('Bubblesort');
    for(let i = 0; i < Array.length; i++){
        yield* Code().selection([[[1, 0], [1, 100]]], .5);
        for(let j = 0; j < Array.length-i-1; j++){
            yield* Code().selection([[[2, 0], [2, 100]]], .5);
            yield* Code().selection([[[3, 0], [3, 100]]], .5);
            if(Array[j] > Array[j+1]){
                yield* all(
                    Code().selection([[[4, 0], [4, 100]]], .5),
                    StepBubble(j, j+1, Elements, Text_, Array, true),
                );
            } else yield* StepBubble(j, j+1, Elements, Text_, Array, false);
        }
        yield* tween(0.5, color =>{
            Elements[Array.length-i-1].stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.green), 
                    easeInOutCubic(color),
                )
            )
        })
    }
    yield* Code().selection([[[0,0], [7, 100]]], .5)

    yield* waitUntil('Next');
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