# Restash Changes

## 01-27-2022

- Fix issue where persistent keys could not use dot notation.
- Fix merging of initial state with persistent state.

## 11-19-2021

- Allow use store at hook to provide initial value.

## 08-25-2021

- Update packages.

## 06-27-2021

- Remove unnecessary console message :(

## 04-21-2021

- update packages, update webpack for demo.

## 07-14-2020 (0.1.21)

- Improve SSR support when getting initialState.

## 06-16-2020 (0.1.21)

- Fix issue where setImmediate may not be avail.

## 05-24-2020 (0.1.19)

- When "persistentKeys" are set generate "perisistent" key if not defined.

## 01-09-2020

- Add ability to filter which keys are peristed to storage when enabled.
- Add type convenience method to clear persisted storage.