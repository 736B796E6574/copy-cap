def operations_on_data(numbers):
    summation = sum(numbers)
    multiplication = 1
    for i in numbers:
        multiplication *= i
    return summation, multiplication

def display_results(sum_result, product_result):
    print(f"The sum of the numbers is: {sum_result}")
    print(f"The product of the numbers is: {product_result}")

numbers_list = [2, 3, 4, 5]
sum_val, product_val = operations_on_data(numbers_list)
display_results(sum_val, product_val)
