/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
export declare class MaxHeap<T> {
    private priorityQueue;
    private numberOfElements;
    private getElementValue;
    constructor(maxSize: number, getElementValue: (element: T) => number);
    enqueue(x: T): void;
    dequeue(): T;
    empty(): boolean;
    size(): number;
    all(): T[];
    max(): T;
    private swim;
    private sink;
    private getValueAt;
    private less;
    private exchange;
}
