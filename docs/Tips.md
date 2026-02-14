# Tips

## TypeScript

The best way to iterate over an array in JavaScript depends on your specific use case:

- Use .map() when you want to transform each element and create a new array with the results.
- Use .filter() to select elements that meet certain criteria and return a new array of those elements.
- Use .forEach() when you want to execute a function for each element but don’t need a return value (e.g., for side effects like logging or updating external state).
- Use .reduce() when you want to combine all elements into a single value (like summing numbers).
- Use a for...of loop for simple, readable iteration over array values, especially when you need to use break or continue.
  - `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of`
- Use a classic for loop if you need maximum control over the iteration process or want the best possible performance in critical code.

## TSX

```tsx
<nav className="space-y-2">
	{([...data.skills] as Skill[]).map((skill) => {
		return (
			<div key={skill.id} className="whitespace-nowrap">
				<Link
					to="/skills/$skillId"
					params={{
						skillId: skill.id
					}}
					className="flex items-center gap-2 rounded-lg p-2 hover:bg-zinc-800/50 hover:text-white dark:text-zinc-400 dark:hover:text-white"
					activeProps={{ className: '' }}
				>
					<div>{skill.name}</div>
				</Link>
			</div>
		);
	})}
</nav>
```
