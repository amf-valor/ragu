import { DebugElement, DebugNode, Predicate } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";

declare module '@angular/core/testing'{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentFixture<T>{
    queryOnDebugElement(predicate: Predicate<DebugNode>) : DebugElement
  }
}

ComponentFixture.prototype.queryOnDebugElement = function(predicate: Predicate<DebugNode>){
  return this.debugElement.query(predicate);
};

export {};

