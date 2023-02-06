import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Text } from '@motion-canvas/2d/lib/components/'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { Colors } from '../styles'
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';


export default makeScene2D(function* (view) {
    const Elements: Rect[] = [];
    const Array1 = [6, 5, 3, 1, 8, 7, 2]

    const textStyle = {
        fontSize: 60,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    for(let i = 0; i < Array1.length; i++){
        view.add(
            <Rect
                ref={makeRef(Elements, i)}
                height={128}
                width={128}
                lineWidth={8}
                radius={new Spacing(4)}
                x={-((Array1.length * (128 + 28)) / 2) + i * (128 + 28) + (128 + 28) / 2 }
            >
                <Text text={Array1[i].toString()} {...textStyle} />
            </Rect>
        )
    }
    
    yield* waitUntil('Steps');
    yield* Steps(Elements);
    yield* waitUntil('Compares');
    yield* Compares(Elements[2], Elements[3]);
    yield* waitUntil('Swaps');
    yield* Swaps(Elements[2], Elements[3]);
    yield* waitUntil('Rotate');
    yield* Rotate(Elements);
    yield* waitUntil('Next');
})

function* Steps(Elements: Rect[]){
    Elements[0].stroke(Colors.green)
    yield* waitFor(0.2)
    for(let i = 1; i < 7; i++){
        Elements[i-1].stroke('#242424');
        Elements[i].stroke(Colors.green);
        yield* waitFor(0.2);
    }
    Elements[Elements.length-1].stroke('#242424');
} 

function* Compares(Element1: Rect, Element2: Rect){
    yield* all(
        tween(.5, color => {
            Element1.stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.blue),
                    easeInOutCubic(color),
                )
            );
        }),
        tween(.5, color => {
            Element2.stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.blue),
                    easeInOutCubic(color),
                )
            );
        }),
    )

    yield* waitUntil('next');

    yield* all(
        tween(.3, color => {
            Element1.stroke(
                Color.lerp(
                    new Color(Colors.blue),
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            );
        }),
        tween(.3, color => {
            Element2.stroke(
                Color.lerp(
                    new Color(Colors.blue),
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            );
        }),
    )
}

function* Swaps(Element1: Rect, Element2: Rect){
    const E1 = Element1.absolutePosition();
    const E2 = Element2.absolutePosition();
    yield* all(
        Element1.absolutePosition(E2, 1),
        Element2.absolutePosition(E1, 1),
    )
    // Element1.absolutePosition(E1);
    // Element2.absolutePosition(E2);
    // Element2.moveUp(); // move them
}

function* Rotate(Array: Rect[]){
    for(let i = 0; i < Array.length; i++){
        yield* all(
            tween(.5, pos => {
                Array[i].position(
                    Vector2.lerp(
                        Array[i].position(),
                        new Vector2(0, -((Array.length * (128 + 14 )) / 2) + i * (128 + 14) + (128 + 14) / 2 ),
                        easeInOutCubic(pos),
                    )
                )
            })
        )
    }
    yield waitUntil('Bubble');
    yield* tween(.3, color => {
        Array[3].stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.blue),
                easeInOutCubic(color),
            )
        );
    });
    for(let i = 3; i > 0; i--){
        yield* Swaps(Array[3], Array[i-1]);
    }
    Array[3].moveToBottom();
    yield* tween(.3, color => {
        Array[3].stroke(
            Color.lerp(
                new Color(Colors.blue),
                new Color('#242424'),
                easeInOutCubic(color),
            )
        );
    });
    yield waitUntil('Sinks');
    yield* tween(.3, color => {
        Array[4].stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.red),
                easeInOutCubic(color),
            )
        );
    });
    Array[4].moveToTop();
    for(let i = 4; i < Array.length-1 ; i++){
        yield* Swaps(Array[4], Array[i+1]);
    }
    yield* tween(.3, color => {
        Array[4].stroke(
            Color.lerp(
                new Color(Colors.red),
                new Color('#242424'),
                easeInOutCubic(color),
            )
        );
    });
}