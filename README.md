# ASDF GAME
September 19, 2024
An endless horde of conditional logic flows up from the bottom of the screen

```js
(A) (S)
(A | S) (A) (A)
(F) (A & D) (F)
(S | D | F) (S)
(S) (A) (F) (D)
// ... (new row incoming from bottom after each input)

// Player input: 'AS' (spacebar), then all matching get destroyed
```

You must determine which 
characters (ASDF) to enter
to destroy the most enemies 
at any given time

For example, the player presses
"AS" then spacebar to input,
and that removes (A | S), (A), (S), etc
the characters above them fall downwards

Consider making in node or python with blessed 


September 19, 2024
Concept
Between 1 and 4 Enemies and Allies show up, each showing a bit of logic above their head and a consequence

For example,
```js
const goblin = {
  health: 2,
  condition: `A || B`,
  notSatisfied: () => {
    player.health -= 1
    this.strength += 1
  },
  satisfied: () => {
    this.health -= 5
  }
}
const orc = {
  health: 5,
  condition: `A && B`,
  notSatisfied: () => {
    player.health -= 2
  },
  satisfied: () => {
    this.health -= 5
  }
}
const candybar = {
  condition: `A`,
    notSatisfied: () => {
    this.destroy()
  },
  satisfied: () => {
    player.health += 2
  },
}
```
The optimal move for the player in this situation is to play "A" and "B", as it will attack the orc and the goblin and pick up the candybar. 


September 18, 2024
TODO:
- Add objective/reason for player to visit nodes
- Add enemy for player to avoid

Idea:
- In between combat, The player spends their points to create new nodes and edges between the nodes
-  They can also place soldiers on the nodes
-  

When you click on a node, all adjacent soldiers move to that node, for example, 
if you have 
2 and 2 they move together to make a group of 4 at the node

The nodes spawn a mechanic where it increases 

Enemies spawn and try to destroy nodes you build 

If you're on a node when it's destroyed, you lose

When you're on a node and you hold down the pointer you shoot at the enemies

Different nodes have different guns 
you get points by killing the enemies

So kind of like a more manual version of tower defense

Active tower defense

